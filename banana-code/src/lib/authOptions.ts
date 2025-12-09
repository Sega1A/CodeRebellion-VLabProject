import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftProvider from "next-auth/providers/azure-ad";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!valid) return null;
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID! as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET! as string,
      tenantId: process.env.MICROSOFT_TENANT_ID! as string,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true, name: true },
        });

        if (dbUser) {
          token.id = dbUser.id!;
          token.role = dbUser.role;
          token.name = dbUser.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/api/auth/signin") || url === baseUrl) {
        return `${baseUrl}/home`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user }) {
      if (!user) return false;
      await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });
      return true;
    },
  },
};
