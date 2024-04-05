import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
// We declare a global variable to hold the PrismaClient instance
// Global this is not affected by hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

// Check to use this instance of Prisma Client or create a new one
export const db = globalThis.prisma || new PrismaClient();

// If we're in development, set the global variable to the instance of Prisma Client
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export { initialServer } from "@/lib/db/initial-server";
export { initialProfile } from "@/lib/db/initial-profile";
