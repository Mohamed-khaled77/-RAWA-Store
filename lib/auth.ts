import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "رقم الموبايل", type: "text" },
        password: { label: "كلمة السر", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        const customer = await prisma.customer.findUnique({
          where: { phone: credentials.phone },
        });
        if (!customer) return null;

        const valid = await bcrypt.compare(credentials.password, customer.password);
        if (!valid) return null;

        return {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          role: customer.role,
          avatarUrl: customer.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Fetch fresh data from DB to reflect profile updates immediately
        const freshUser = await prisma.customer.findUnique({
          where: { id: token.id as string },
          select: { name: true, avatarUrl: true, role: true, phone: true }
        });

        if (freshUser) {
          (session.user as any).id = token.id;
          session.user.name = freshUser.name;
          session.user.image = freshUser.avatarUrl;
          (session.user as any).role = freshUser.role;
          (session.user as any).phone = freshUser.phone;
        } else {
          (session.user as any).id = token.id;
          (session.user as any).role = token.role;
          (session.user as any).phone = token.phone;
        }
      }
      return session;
    },
  },
};
