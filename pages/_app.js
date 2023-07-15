import "@/styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";

import Layout from "../components/templates/Layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
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

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
