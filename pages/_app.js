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
      {/* <meta name="description" content="" /> */}
      {/* <meta name="keywords" content="" /> */}
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
      {/* {Component.auth ? (
        <Auth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      ) : (
        <Component {...pageProps} />
      )} */}

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

// function Auth({ children }) {
//   // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
//   const { status } = useSession();

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   return children;
// }
