import { DashboardLayout } from "components-layout/DashboardLayout";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "types/index";
import { AppType } from "next/app";
import { trpc } from "utils/trpc";

import "../styles/globals.css";

import type { Session } from "next-auth";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) => {
    return (
        <SessionProvider session={session}>
            {Component.layout == "dashboard" ? (
                <DashboardLayout>
                    <Component {...pageProps} />
                </DashboardLayout>
            ) : (
                <Component {...pageProps} />
            )}
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);
