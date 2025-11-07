import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    path: path.join("prisma", "migrations"),
    
    seed:
      'ts-node --compiler-options {"module":"CommonJS","moduleResolution":"node"} prisma/seed.ts',
  },
});