import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;
        if (email !== ADMIN_EMAIL) return null;

        const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isValid) return null;

        return { id: "admin", name: "PakAiVerse Admin", email: ADMIN_EMAIL };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn() {
      return true; // Allow all google signins (clients and admin)
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
});
