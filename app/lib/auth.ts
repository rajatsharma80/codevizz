import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) return null;

        let dbUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!dbUser) {
          const hashedPassword = await bcrypt.hash(credentials.password, 12);
          dbUser = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              first_name: '',
              last_name: '',
              created_by: credentials.email,
              modified_by: credentials.email,
              login_ts: new Date()
            },
          });
        } else {
          if (dbUser.password) {
            const isPasswordValid = await bcrypt.compare(credentials.password, dbUser.password);
            if (!isPasswordValid) return null;
          } else {
            // If password is null or undefined in the DB, reject login
            return null;
          }
        }

        const { id, password, ...userWithoutPassword } = dbUser;
        return {userWithoutPassword,id: String(id)};
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = user; // Attach user object to session
      return session;
    },
    async signIn({ user, account, profile }) {
      // Ensure account is not null and email is valid
      if (account && (account.provider === "google" || account.provider === "github")) {
        if (user.email) {  // Ensure user.email is a valid string
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
  
          // If user doesn't exist, create them in the database
          if (!dbUser) {
            await prisma.user.create({
              data: {
              email: user.email,
              first_name: user.name?.split(' ')[0] || '',
              last_name: user.name?.split(' ')[1] || '',
              image: user.image || '',
              created_by: user.email,
              modified_by: user.email,
              login_ts: new Date()
              },
            });
          }
        } else {
          console.error("User email is missing.");
        }
      }
  
      return true;
    },
  }
};
