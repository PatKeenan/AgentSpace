import { DashboardLayout } from "components-layout/DashboardLayout";
import { ErrorBoundary } from "components-core/ErrorBoundary";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "types/index";
import { AppType } from "next/app";
import { trpc } from "utils/trpc";

import "../styles/globals.css";

import type { Session } from "next-auth";
import { XMarkIcon } from "@heroicons/react/20/solid";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) => {
    return (
        <ErrorBoundary>
            <SessionProvider session={session}>
                {Component.layout == "dashboard" ? (
                    <DashboardLayout>
                        <Component {...pageProps} />
                    </DashboardLayout>
                ) : (
                    <Component {...pageProps} />
                )}
            </SessionProvider>
        </ErrorBoundary>
    );
};

export default trpc.withTRPC(MyApp);
