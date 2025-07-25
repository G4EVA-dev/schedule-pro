import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Ensure the user object has the id property
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
});

export { handler as GET, handler as POST };