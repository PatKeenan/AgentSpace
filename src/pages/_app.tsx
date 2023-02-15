export { reportWebVitals } from "next-axiom";
import { ErrorBoundary } from "components-core/ErrorBoundary";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "types/index";
import { AppType } from "next/app";
import { trpc } from "utils/trpc";
import {
    DashboardLayout,
    AppointmentsLayout,
    ContactLayout,
} from "components-layout";
import "../styles/globals.css";

import type { Session } from "next-auth";
import Head from "next/head";
import AuthLayout from "components-layout/AuthLayout";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) => {
    const getSubLayout = () => {
        switch (Component.subLayout) {
            case "appointments": {
                return (
                    <AppointmentsLayout>
                        <Component {...pageProps} />
                    </AppointmentsLayout>
                );
            }
            case "contact": {
                return (
                    <ContactLayout>
                        <Component {...pageProps} />
                    </ContactLayout>
                );
            }
            default: {
                return <Component {...pageProps} />;
            }
        }
    };
    return (
        <>
            <Head>
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black-translucent"
                />

                <meta
                    name="viewport"
                    content="initial-scale=1, viewport-fit=cover"
                />
            </Head>
            <Analytics />
            <ErrorBoundary>
                <SessionProvider session={session}>
                    <AuthLayout>
                        {Component.layout == "dashboard" ? (
                            <DashboardLayout>{getSubLayout()}</DashboardLayout>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </AuthLayout>
                </SessionProvider>
            </ErrorBoundary>
        </>
    );
};

export default trpc.withTRPC(MyApp);
