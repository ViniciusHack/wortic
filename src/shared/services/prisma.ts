// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    errorFormat: "minimal",
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      errorFormat: "minimal",
    });
  }
  prisma = global.prisma;
}

export default prisma;