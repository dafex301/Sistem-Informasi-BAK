import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import Loading from "../../components/Loading";
import { loginAccount } from "../../firebase/account";

// Icon
import googleIcon from "../../public/icons/google.svg";
import facebookIcon from "../../public/icons/facebook.svg";
import githubIcon from "../../public/icons/github.svg";

const Login: NextPage = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user, userData, loading } = useAuth();
  const auth = getAuth();
  const route = useRouter();

  function handleLogin() {
    loginAccount(auth, identifier, password)
      .then(() => {
        route.push("/");
      })
      .catch((error) => {
        setError("Login gagal. Email dan/atau password salah.");
        // setIdentifier("");
        // setPassword("");
      });
  }

  function handleLoginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      // .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      // const user = result.user;
      // })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The identifier of the user's account used.
        const identifier = error.identifier;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  if (!loading && !user) {
    return (
      <>
        <Head>
          <title>Login</title>
          <link rel="icon" href="/undip.png" />
        </Head>
        <div className="flex items-center justify-center h-screen">
          {/* Login Container */}
          <div className="min-w-fit flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] ">
            <div className="mb-8 flex flex-col justify-center items-center">
              <Image src="/undip.png" alt={"undip"} width={80} height={80} />
              <h1 className="w-11/12 text-center text-2xl font-medium mt-3">
                Sistem Informasi
              </h1>
              <h1 className="w-11/12 text-center">
                Biro Akademik dan Kemahasiswaan
              </h1>
            </div>
            <div className="flex flex-col text-sm rounded-md">
              <input
                className="mb-5 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 "
                type="text"
                placeholder="Email/NIP/NIM"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                name="identifier"
              />
              <input
                className="border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />
            </div>
            <button
              className="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 duration-300"
              onClick={handleLogin}
            >
              Masuk
            </button>
            {/* Error message */}
            {error && <div className="mt-5 text-sm text-red-500">{error}</div>}
            <div className="mt-5 flex justify-between text-sm text-gray-600">
              <button className="hover:underline">Lupa password?</button>
              <Link href="/auth/register" className="hover:underline">
                Daftar
              </Link>
            </div>
            <div className="flex justify-center mt-5 text-sm">
              <p className="text-gray-400">Atau login menggunakan</p>
            </div>
            <div className="mt-3 items-center flex justify-center gap-3">
              <Image
                onClick={handleLoginWithGoogle}
                className="grayscale cursor-pointer hover:grayscale-0 scale-105 duration-300"
                src={googleIcon}
                alt={"Google Icon"}
              />
              <Image
                className="grayscale cursor-pointer hover:grayscale-0 scale-105 duration-300 "
                src={githubIcon}
                alt={"Github Icon"}
                width={25}
              />
              <Image
                className="ml-2 grayscale cursor-pointer hover:grayscale-0 scale-105 duration-300"
                src={facebookIcon}
                alt={"Facebook Icon"}
                width={26}
              />
            </div>
            <div className="mt-5 flex text-center text-sm text-gray-400">
              <p>
                Jika terdapat pertanyaan seputar sistem dapat menghubungi
                <br />
                <a className="underline">@dafex30</a> via instagram.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (user && userData) {
    route.push("/");
  }

  if (user && !userData) {
    route.push("/auth/data");
  }

  return <Loading />;
};

export default Login;
