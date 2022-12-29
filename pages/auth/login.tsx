import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import { loginAccount, loginWithProvider } from "../../firebase/account";

// Icon
import googleIcon from "../../public/icons/google.svg";
import facebookIcon from "../../public/icons/facebook.svg";
import githubIcon from "../../public/icons/github.svg";
import microsoftIcon from "../../public/icons/microsoft.svg";

const Login: NextPage = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user, userData, loading } = useAuth();

  const route = useRouter();

  function handleLogin() {
    loginAccount(identifier, password).catch((error) => {
      setError("Login gagal. Email dan/atau password salah.");
    });
  }

  function handleLoginWithProvider(provider: string) {
    loginWithProvider(provider).catch((error) => {
      if (error.code == "auth/account-exists-with-different-credential") {
        setError(
          "Login gagal. Email sudah digunakan untuk login dengan cara lain."
        );
      }
    });
  }

  if (!loading && !user) {
    return (
      <>
        <Head>
          <title>Login</title>
          <link rel="icon" href="/undip.png" />
        </Head>
        <div className="flex flex-col text-sm rounded-md">
          <input
            className="mb-5 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 "
            type="text"
            placeholder={"Email/NIM/NIP"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            name="identifier"
          />
          <input
            className={
              "mb-5 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 "
            }
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          />
        </div>
        <button
          className="w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 duration-300"
          onClick={handleLogin}
        >
          {"Masuk"}
        </button>
        {/* Error message */}
        {error && <div className="mt-5 text-sm text-red-500">{error}</div>}
        <div className="mt-5 flex justify-between text-sm text-gray-600">
          <Link href="/auth/forget" className="hover:underline">
            {"Lupa password?"}
          </Link>
          <Link href="/auth/register" className="hover:underline">
            Daftar
          </Link>
        </div>
        <div className="flex justify-center mt-5 text-sm">
          <p className="text-gray-400">Atau login menggunakan</p>
        </div>
        <div className="mt-3 items-center flex justify-center gap-3">
          <Image
            onClick={() => handleLoginWithProvider("google")}
            className="grayscale cursor-pointer hover:grayscale-0 scale-105 duration-300"
            src={googleIcon}
            alt={"Google Icon"}
          />
          <Image
            onClick={() => handleLoginWithProvider("github")}
            className="grayscale cursor-pointer hover:grayscale-0 scale-105 duration-300 "
            src={githubIcon}
            alt={"Github Icon"}
            width={25}
          />
          <Image
            onClick={() => handleLoginWithProvider("facebook")}
            className="ml-2 grayscale cursor-pointer hover:grayscale-0 scale-105 duration-300"
            src={facebookIcon}
            alt={"Facebook Icon"}
            width={26}
          />
          <Image
            onClick={() => handleLoginWithProvider("microsoft")}
            className="ml-3 grayscale cursor-pointer hover:grayscale-0 scale-105 duration-300"
            src={microsoftIcon}
            alt={"Facebook Icon"}
            width={25}
          />
        </div>
      </>
    );
  }

  if (!loading && user && !userData) {
    route.push("/auth/data");
  }

  return <></>;
};

export default Login;
