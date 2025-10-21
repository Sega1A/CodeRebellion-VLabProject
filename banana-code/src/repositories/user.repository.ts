import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const UserRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  create: (data: Omit<User, "id">) => prisma.user.create({ data }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  changeRole: (id: string, role: User["role"]) =>
    prisma.user.update({ where: { id }, data: { role } }),
  getUsers: () =>
    prisma.user.findMany({
      where: {
        role: {
          not: "ADMINISTRADOR",
        },
      },
    }),
};
