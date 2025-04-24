import { PrismaClient } from '@prisma/client';

// Prevent multiple PrismaClient instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Reuse existing instance or create a new one
const prisma = global.prisma || new PrismaClient();

// Store instance in global for development hot reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
