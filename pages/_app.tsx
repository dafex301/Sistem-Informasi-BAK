import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import FirebaseProvider from "../lib/authContext";
import "../lib/firebaseConfig/init";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const route = useRouter();

  if (route.pathname === "/login" || route.pathname === "/register") {
    return (
      <FirebaseProvider>
        <Component {...pageProps} />
      </FirebaseProvider>
    );
  }

  return (
    <FirebaseProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseProvider>
  );
}
export default MyApp;
