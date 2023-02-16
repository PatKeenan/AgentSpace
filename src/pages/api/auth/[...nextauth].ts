import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "server/db/client";
import { env } from "../../../env/server.mjs";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

const allowedUsers = [
    "morgan.cullers@gmail.com",
    "patkeenan316@gmail.com",
    "patkeenan.dev@gmail.com",
    "ford.dave7@gmail.com",
    "jwkeenan60@gmail.com",
    "peter@urbanemu.com",
];
export const authOptions: NextAuthOptions = {
    theme: {
        colorScheme: "light",
    },

    callbacks: {
        async signIn({ user }) {
            if (user.email) {
                const userInDb = await prisma.betaUsers.findUnique({
                    where: { email: user.email },
                });
                if (userInDb && user.email == userInDb.email) {
                    return true;
                }
                return false;
            }
            return false;
        },
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    secret: env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        }),
        EmailProvider(
            /*  process.env.NODE_ENV == "production"
                ? {
                      server: {
                          host: env.SEND_GRID_HOST,
                          port: env.SEND_GRID_PORT,
                          auth: {
                              user: env.SEND_GRID_USER,
                              pass: env.SEND_GRID_PASS,
                          },
                          from: env.EMAIL_FROM,
                      },
                  }
                : */ {
                server: env.EMAIL_SERVER,
                from: env.EMAIL_FROM,
            }
        ),
    ],

    debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
