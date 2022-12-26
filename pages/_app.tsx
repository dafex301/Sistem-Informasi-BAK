import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import FirebaseProvider from "../lib/authContext";
import "../lib/firebaseConfig/init";
import { useRouter } from "next/router";
import { AuthLayout } from "../components/layout/AuthLayout";

function MyApp({ Component, pageProps }: AppProps) {
  const route = useRouter();

  if (route.pathname.startsWith("/auth")) {
    return (
      <FirebaseProvider>
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
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
