import { NextRequest, NextResponse } from 'next/server';
import  { prisma } from 'lib/prisma';

export async function GET(req: NextRequest) {
const telegramId = Number(req.nextUrl.searchParams.get('telegramId'));
if (!telegramId) {
return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
}

try {
// Find the user by telegramId to get their ObjectId
const user = await prisma.user.findUnique({
where: { telegramId },
select: { id: true },
});
if (!user) {
return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

// Fetch referrals for the user
const referrals = await prisma.referral.findMany({
where: { referrerId: user.id },
select: {
referredUserId: true,
referredUser: { select: { telegramId: true, username: true } },
earnings: true,
},
});

// Calculate total referral points (convert earnings from FLX to points)
const referralPoints = referrals.reduce((sum, r) => sum + r.earnings * 1000, 0); // 1 FLX = 1000 points

// Map referrals to the format expected by the frontend
const referredUsers = referrals
.filter(r => r.referredUser) // Exclude referrals with no referredUser
.map(r => ({
telegramId: r.referredUser!.telegramId,
username: r.referredUser!.username,
}));

return NextResponse.json({
referrals: referredUsers,
referralPoints: Math.round(referralPoints), // Ensure integer points
});
} catch (error) {
console.error('Error fetching referrals:', error);
return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
}
}

export async function POST(req: NextRequest) {
try {
const { referrerTelegramId, referredTelegramId } = await req.json();
if (!referrerTelegramId || !referredTelegramId) {
return NextResponse.json({ error: 'referrerTelegramId and referredTelegramId are required' }, { status: 400 });
}
if (referrerTelegramId === referredTelegramId) {
return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 });
}

// Validate users by telegramId
const referrer = await prisma.user.findUnique({ where: { telegramId: referrerTelegramId } });
const referred = await prisma.user.findUnique({ where: { telegramId: referredTelegramId } });
if (!referrer) {
return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
}
if (!referred) {
return NextResponse.json({ error: 'Referred user not found' }, { status: 404 });
}

// Check for existing referral
const existingReferral = await prisma.referral.findFirst({
where: { referrerId: referrer.id, referredUserId: referred.id },
});
if (existingReferral) {
return NextResponse.json({ error: 'Referral already exists' }, { status: 409 });
}

// Create referral and update points in a transaction
const referral = await prisma.$transaction([
prisma.referral.create({
data: {
referrerId: referrer.id,
referredUserId: referred.id,
earnings: 0.05, // 0.05 FLX per referral
},
}),
prisma.user.update({
where: { id: referrer.id },
data: { points: { increment: 50 } }, // 0.05 FLX = 50 points
select: { points: true, telegramId: true },
}),
]);

const createdReferral = referral[0];
const updatedUser = referral[1];

return NextResponse.json(
{
referral: {
referrerTelegramId: referrer.telegramId,
referredTelegramId: referred.telegramId,
earnings: createdReferral.earnings,
},
referralPoints: 50, // Points for this referral
totalReferralPoints: (await prisma.referral.count({ where: { referrerId: referrer.id } })) * 50,
userPoints: updatedUser.points,
},
{ status: 201 }
);
} catch (error: unknown) {
console.error('Error creating referral:', error);
// Check if error is a Prisma unique constraint violation
if (error instanceof Error && 'code' in error && error.code === 'P2002') {
return NextResponse.json({ error: 'Referral already exists' }, { status: 409 });
}
return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 });
}
}