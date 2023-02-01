import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import FirebaseProvider from "../lib/authContext";
import "../lib/firebaseConfig/init";
import { useRouter } from "next/router";
import { ThemeProvider } from "@material-tailwind/react";

// Import style
import "../components/forms/css/DragDropFile.css";

function MyApp({ Component, pageProps }: AppProps) {
  const route = useRouter();

  if (route.pathname.startsWith("/auth")) {
    return (
      <ThemeProvider>
        <FirebaseProvider>
          <Component {...pageProps} />
        </FirebaseProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <FirebaseProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FirebaseProvider>
    </ThemeProvider>
  );
}
export default MyApp;
