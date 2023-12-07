import { PrismaClient } from ".prisma/client";

export function createContext() {
  const prisma = new PrismaClient();

  return { prisma };
}
