import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const UserRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  create: (data: Omit<User, "id">) => prisma.user.create({ data }),
};
