import { NextRequest, NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET(req: NextRequest) {
  const telegramId = Number(req.nextUrl.searchParams.get('telegramId'));
  if (!telegramId) {
    return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      select: {
        username: true,
        firstName: true,
        lastName: true,
        points: true,
        referralCode: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username || 'gamemaster',
      firstName: user.firstName,
      lastName: user.lastName,
      points: user.points,
      referralCode: user.referralCode || 'REF123',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { telegramId, username, firstName, lastName, points = 0, referralCode } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        telegramId,
        username,
        firstName,
        lastName,
        points,
        referralCode,
      },
      select: {
        telegramId: true,
        username: true,
        firstName: true,
        lastName: true,
        points: true,
        referralCode: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { telegramId, points } = await req.json();
    if (!telegramId || points === undefined) {
      return NextResponse.json({ error: 'telegramId and points are required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { telegramId },
      data: { points },
      select: {
        username: true,
        points: true,
        referralCode: true,
      },
    });

    return NextResponse.json({
      username: user.username || 'gamemaster',
      points: user.points,
      referralCode: user.referralCode || 'REF123',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
