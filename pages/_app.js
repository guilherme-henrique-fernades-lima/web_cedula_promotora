import "@/styles/globals.css";
import Head from "next/head";
import { SessionProvider, useSession } from "next-auth/react";

import Layout from "../components/templates/Layout";

function HeadWebsite() {
  return (
    <Head>
      <title>Cédula Promotora</title>
      <meta name="theme-color" content="#1976d2" />
      <meta name="msapplication-navbutton-color" content="#1976d2" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#1976d2" />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon/poupança-blue-ui-96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/poupança-blue-ui-32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/poupança-blue-ui-16.png"
      />
      <link rel="manifest" href="/site.webmanifest"></link>
    </Head>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={15 * 60}
    >
      <HeadWebsite />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
