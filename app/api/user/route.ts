import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'

// Helper function to generate a random referral code
function generateRandomCode(length = 8): string {
  return Math.random().toString(36).substr(2, length).toUpperCase()
}

// Helper function to generate a unique referral code
async function generateUniqueReferralCode(): Promise<string> {
  let code: string
  let isUnique = false

  while (!isUnique) {
    code = generateRandomCode()
    const existingUser = await prisma.user.findUnique({
      where: { referralCode: code },
    })
    if (!existingUser) {
      isUnique = true
    }
  }
  return code!
}

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json()

    // Validate request body
    if (!userData?.id) {
      return NextResponse.json(
        { error: 'Missing required user ID' },
        { status: 400 }
      )
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
    })

    // Update existing user if information changed
    if (user) {
      const shouldUpdate =
        user.username !== userData.username ||
        user.firstName !== userData.first_name ||
        user.lastName !== userData.last_name

      if (shouldUpdate) {
        user = await prisma.user.update({
          where: { telegramId: userData.id },
          data: {
            username: userData.username || '',
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
          },
        })
      }
      return NextResponse.json(user)
    }

    // Handle new user creation
    const referralCodeFromRequest = userData.referralCode
    let referrer = null

    // Look up referrer if code is provided
    if (referralCodeFromRequest) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: referralCodeFromRequest },
      })
    }

    // Generate unique referral code for new user
    const newUserReferralCode = await generateUniqueReferralCode()

    // Create user and handle referral in a transaction
    user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          telegramId: userData.id,
          username: userData.username || '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          referralCode: newUserReferralCode,
        },
      })

      // Process valid referral
      if (referrer) {
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: newUser.id,
            earnings: 10.0, // Initial referral earnings
          },
        })

        // Update referrer's points (100 points = 0.1 FLX assuming points are in cents)
        await tx.user.update({
          where: { id: referrer.id },
          data: { points: { increment: 100 } },
        })
      }

      return newUser
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error processing user request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}