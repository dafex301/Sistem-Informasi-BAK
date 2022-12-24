import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import FirebaseProvider from "../lib/authContext";
import "../lib/firebaseConfig/init";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseProvider>
  );
}
export default MyApp;
