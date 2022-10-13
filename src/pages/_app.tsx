// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { trpc } from "../utils/trpc";
import Head from "next/head";
import { DashboardLayout } from "components-layout/DashboardLayout";
import { AppType } from "next/app";
import { AppProps } from "types/index";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <SessionProvider session={session}>
        {Component.layout == "dashboard" ? (
          <DashboardLayout>
            <Component {...pageProps} />
          </DashboardLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
