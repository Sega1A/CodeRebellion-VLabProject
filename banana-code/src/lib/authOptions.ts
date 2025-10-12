import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftProvider from "next-auth/providers/azure-ad";
// import KeycloakProvider from "next-auth/providers/keycloak";
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
        return {
          ...user,
          id: user.id.toString(),
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID! as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET! as string,
      tenantId: process.env.MICROSOFT_TENANT_ID! as string,
    }),
    // KeycloakProvider({
    //   clientId: process.env.KEYCLOAK_CLIENT_ID! as string,
    //   clientSecret: process.env.KEYCLOAK_CLIENT_SECRET! as string,
    //   issuer: process.env.KEYCLOAK_ISSUER! as string,
    // }),
  ],
  session: { strategy: "jwt" },
  // pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Temporal redirection.
      return "/home";
    },
  },
};
