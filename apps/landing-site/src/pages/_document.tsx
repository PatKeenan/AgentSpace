import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html
            lang="en"
            className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
        >
            <Head>
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <body className="flex h-full flex-1 flex-col">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
