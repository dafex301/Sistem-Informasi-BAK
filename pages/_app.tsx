import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import FirebaseProvider from "../lib/authContext";
import "../lib/firebaseConfig/init";
import { useRouter } from "next/router";
import { ThemeProvider } from "@material-tailwind/react";

// Import style
import "../styles/globals.css";
import "../components/forms/css/DragDropFile.css";
// import "react-tailwind-table/dist/index.css";
import "react-toastify/dist/ReactToastify.css";

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

  if (route.pathname === "/") {
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
