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
            if (user.email && allowedUsers.includes(user.email)) return true;
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
        EmailProvider({
            server: env.EMAIL_SERVER,
            from: env.EMAIL_FROM,
        }),
    ],

    debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
