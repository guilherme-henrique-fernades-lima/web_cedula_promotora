import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;

        const res = await fetch(
          "http://127.0.0.1:8005/integracao/auth/login/",
          {
            method: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              email: username,
              password: password,
            }),
          }
        );

        const user = await res.json();

        if (res.status == 200) {
          return user;
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    session({ session, token }) {
      session.user = token.user;
      return session;
    },

    async jwt({ token, account, user }) {
      if (account) {
        token.user = user;
      }

      return token;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: "adiaodasdjasdjlkdjljdlkjdlkajdasdlsa",
};
export default NextAuth(authOptions);
