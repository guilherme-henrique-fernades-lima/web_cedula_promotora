import "@/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

//Custom components
import Layout from "../components/templates/Layout";
import ContextThemeProvider from "@/context/ContextThemeProvider";

//Mui components
import { CssBaseline } from "@mui/material";

function HeadWebsite() {
  return (
    <Head>
      <title>Cédula Promotora</title>
      <meta name="theme-color" content="#1a3d74" />
      <meta name="msapplication-navbutton-color" content="#1a3d74" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#1a3d74" />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon/favicon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
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
      <CssBaseline />
      <HeadWebsite />
      <ContextThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContextThemeProvider>
    </SessionProvider>
  );
}
