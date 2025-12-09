import { PrismaClient, Prisma } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const logs: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error", "warn"];

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: logs,
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
