import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html
            className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
            lang="en"
        >
            <Head>
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black-translucent"
                />

                <meta
                    name="viewport"
                    content="initial-scale=1, viewport-fit=cover"
                />
            </Head>
            <body className="flex h-full flex-1 flex-col">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
