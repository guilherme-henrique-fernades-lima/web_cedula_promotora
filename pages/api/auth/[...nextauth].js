import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

export const authOptions = {
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
          `${process.env.NEXT_INTEGRATION_URL}/auth/login/`,
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
  ],

  callbacks: {
    session({ session, token }) {
      session.user.username = token.user.username;
      session.user.token = token.user.token;
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
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
