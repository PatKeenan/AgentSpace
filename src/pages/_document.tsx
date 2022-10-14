import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html
            className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
            lang="en"
        >
            <Head>
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <body className="flex h-full flex-1 flex-col">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
