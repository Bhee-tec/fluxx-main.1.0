import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function POST(req: NextRequest) {
try {
const { telegramId, score, moves, tiles } = await req.json();

if (!telegramId) {
return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
}

const user = await prisma.user.findUnique({
where: { telegramId },
});

if (!user) {
return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

const gameState = await prisma.gameState.create({
data: {
userId: user.id,
score: score || 0,
moves: moves || 30,
tiles: tiles ? JSON.stringify(tiles) : '', // Store tiles as JSON string
lastPlayed: new Date(),
},
});

return NextResponse.json(gameState);
} catch (error) {
console.error('Error creating game state:', error);
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
}

export async function GET(req: NextRequest) {
try {
const telegramId = req.nextUrl.searchParams.get('telegramId');
if (!telegramId) {
return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
}

const user = await prisma.user.findUnique({
where: { telegramId: parseInt(telegramId) },
});

if (!user) {
return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

const gameState = await prisma.gameState.findFirst({
where: { userId: user.id },
orderBy: { lastPlayed: 'desc' }, // Get the most recent game state
});

if (!gameState) {
return NextResponse.json({ error: 'Game state not found' }, { status: 404 });
}

return NextResponse.json({
...gameState,
tiles: gameState.tiles ? JSON.parse(gameState.tiles) : [],
});
} catch (error) {
console.error('Error fetching game state:', error);
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
}

export async function PATCH(req: NextRequest) {
try {
const { telegramId, score, moves, tiles } = await req.json();

if (!telegramId) {
return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
}

const user = await prisma.user.findUnique({
where: { telegramId },
});

if (!user) {
return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

const gameState = await prisma.gameState.findFirst({
where: { userId: user.id },
orderBy: { lastPlayed: 'desc' },
});

if (!gameState) {
return NextResponse.json({ error: 'Game state not found' }, { status: 404 });
}

const updatedGameState = await prisma.gameState.update({
where: { id: gameState.id },
data: {
score: score !== undefined ? score : gameState.score,
moves: moves !== undefined ? moves : gameState.moves,
tiles: tiles ? JSON.stringify(tiles) : gameState.tiles,
lastPlayed: new Date(),
},
});

// Update user points based on score
if (score !== undefined) {
await prisma.user.update({
where: { id: user.id },
data: { points: score },
});
}

return NextResponse.json({
...updatedGameState,
tiles: updatedGameState.tiles ? JSON.parse(updatedGameState.tiles) : [],
});
} catch (error) {
console.error('Error updating game state:', error);
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
}
