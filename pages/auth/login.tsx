import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import { loginAccount, loginWithProvider } from "../../firebase/account";

const Login: NextPage = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user, loading } = useAuth();

  const route = useRouter();

  function handleLogin(e: any) {
    e.preventDefault();
    loginAccount(identifier, password).catch((error) => {
      console.log(error);
      setError("Login gagal. username dan/atau password salah.");
    });
  }
  if (!loading && !user) {
    return (
      <>
        <Head>
          <title>Login</title>
        </Head>
        <section className="flex flex-col md:flex-row h-screen items-center">
          <div className="bg-indigo-600 hidden md:block w-full md:w-1/2 xl:w-2/3 h-screen">
            <Image
              className="h-full object-cover"
              alt={"Undip"}
              src={"/home.jpg"}
              width={4032}
              height={3024}
            />
          </div>
          <div
            className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
  flex items-center justify-center"
          >
            <div className="w-full h-100">
              <Image
                src="/undip.png"
                alt="Undip"
                width={1024}
                height={1024}
                className="w-1/6"
              />
              <h1 className="text-xl md:text-2xl font-bold leading-tight mt-6">
                SI-BAK Undip
              </h1>
              <form className="mt-6" action="#" onSubmit={handleLogin}>
                {error && (
                  <div className="w-full px-4 py-3 mb-2 text-red-900 bg-red-50 rounded-lg items-center ">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-gray-700">Username/NIP</label>
                  <input
                    type="text"
                    placeholder="Enter Username/NIP"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    required
                    onChange={(e) => setIdentifier(e.target.value)}
                    value={identifier}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
        px-4 py-3 mt-6"
                >
                  Masuk
                </button>
                <hr className="w-full bg-gray-300 h-0.5 mt-6" />
                <button
                  type="button"
                  className="w-full block bg-white border-gray-700 border hover:bg-gray-200 focus:bg-gray-200 text-black font-semibold rounded-lg
                  px-4 py-3 mt-6"
                  onClick={() => route.push("/dashboard")}
                >
                  <span className="">Masuk tanpa Akun</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!loading && user) {
    route.push("/dashboard");
  }

  return <></>;
};

export default Login;
