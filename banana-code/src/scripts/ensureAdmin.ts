import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function ensureAdminExists() {
  const adminEmail = process.env.ADMIN_EMAIL as string;
  const adminPassword = process.env.ADMIN_PASS as string;
  const adminName = process.env.ADMIN_NAME as string;

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMINISTRADOR" },
  });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashed,
        role: "ADMINISTRADOR",
        emailVerified: new Date(),
      },
    });
  }
}
