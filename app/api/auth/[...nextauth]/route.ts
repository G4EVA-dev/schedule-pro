import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcryptjs";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        // Fetch user from Convex by email
        const user = await convex.query(api.auth.getCurrentUser, { email });
        if (!user || !user.hashedPassword) {
          return null;
        }
        // Compare password
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) {
          return null;
        }
        // Return user object for session
        return {
          id: user._id,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          role: user.role,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Create or get user in Convex
          await convex.mutation(api.users.createOAuthUser, {
            email: user.email!,
            name: user.name!,
            image: user.image,
          });
          return true;
        } catch (error) {
          console.error("Error in OAuth sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.sub!,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };