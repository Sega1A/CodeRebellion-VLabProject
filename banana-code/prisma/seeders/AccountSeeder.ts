import { PrismaClient, Role, User } from "@prisma/client";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const USERS_DATA = [
  {
    role: Role.ADMINISTRADOR,
    email: "admin@admin.com",
    name: "Administrador",
    studentCode: null,
    provider: "local",
  },
  {
    role: Role.PROFESOR_EDITOR,
    email: "richardlopez@gmail.com",
    name: "Richard Lopez",
    studentCode: null,
    provider: "google",
    providerAccountId: "102345678901234567890",
  },
  {
    role: Role.ESTUDIANTE,
    email: "mariarocha@gmail.com",
    name: "Maria Rocha",
    studentCode: "S1001",
    provider: "azure-ad",
    providerAccountId: "98765432109876543210",
  },
  {
    role: Role.ESTUDIANTE,
    email: "pedrogutierrez@gmail.com",
    name: "Pedro Gutierrez",
    studentCode: "S1002",
    provider: "local",
  },
];

export const createdUsers: User[] = [];

export async function seedAccounts(prisma: PrismaClient) {
  console.log("Eliminando Cuentas...");
  await prisma.account.deleteMany();
  console.log("Cuentas eliminadas");

  console.log("Ingresando Cuentas...");
  for (const data of USERS_DATA) {
    const isProvider = data.provider !== "local";
    const password = !isProvider ? data.email : "12qwaszx";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        role: data.role,
        studentCode: data.studentCode,
        password: hashedPassword,
      },
      create: {
        id: randomUUID(),
        email: data.email,
        name: data.name,
        role: data.role,
        studentCode: data.studentCode,
        emailVerified: new Date(),
        password: hashedPassword,
      },
    });
    createdUsers.push(user);

    console.log("Ingresando Cuentas...");
    if (isProvider) {
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: data.provider,
            providerAccountId: data.providerAccountId!,
          },
        },
        update: {},
        create: {
          userId: user.id,
          type: "oauth",
          provider: data.provider,
          providerAccountId: data.providerAccountId!,
          access_token: "fake-access-token-" + randomUUID(),
        },
      });
      console.log(
        `Usuario y Cuenta (${data.provider}) creados para: ${user.name}`
      );
    } else {
      console.log(`Usuario (local) creado para: ${user.name}`);
    }
  }
  console.log("Datos de Usuarios y Cuentas finalizada.");
}
