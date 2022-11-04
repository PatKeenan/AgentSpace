import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "server/db/client";
import { env } from "../../../env/server.mjs";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

const allowedUsers = [
    "patkeenan316@gmail.com",
    "patkeenan.dev@gmail.com",
    "ford.dave7@gmail.com",
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

/* 

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@lib-server'
import NextAuth from "next-auth"
import Stripe from "stripe"

export default NextAuth({
  providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM
      }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
      strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findUnique({where: {id: token.sub}, select: {isRegistered: true}})
      session.user.isRegistered = user?.isRegistered ?? false
      session.user.id = token.sub as string
      return session
    },
  },
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2020-08-27",
      });
      await stripe.customers
        .create({
          name: user.name as string,
          email: user.email as string,
        }).then(async (customer) => {
          return prisma.user.update({
            where: {id: user.id},
            data: {
              stripeCustomerId: customer.id
            }
          })
        })
    }
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  
})



*/
