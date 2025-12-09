import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserRole =
  | "ADMINISTRADOR"
  | "ESTUDIANTE"
  | "PROFESOR_EJECUTOR"
  | "PROFESOR_EDITOR";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
