import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/authContext";
import { loginAccount, loginWithProvider } from "../../firebase/account";

// Image
import loginImage1 from "../../public/login/login1.jpg";
import loginImage2 from "../../public/login/login2.jpg";
import loginImage3 from "../../public/login/login3.jpg";
import loginImage4 from "../../public/login/login4.jpg";
import loginImage5 from "../../public/login/login5.jpg";

const Login: NextPage = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [image, setImage] = useState<StaticImageData>(loginImage1);

  useEffect(() => {
    const images = [
      loginImage1,
      loginImage2,
      loginImage3,
      loginImage4,
      loginImage5,
    ];
    const random = Math.floor(Math.random() * images.length);
    setImage(images[random]);
  }, []);

  const { user, loading } = useAuth();

  const route = useRouter();

  function handleLogin() {
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
            <Image className="h-full object-cover" alt={"Undip"} src={image} />
          </div>
          <div
            className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
  flex items-center justify-center"
          >
            <div className="w-full h-100">
              <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
                Log in to your account
              </h1>
              <form className="mt-6" action="#">
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
                <div className="text-right mt-2">
                  <a
                    href="#"
                    className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                  >
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="button"
                  className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
        px-4 py-3 mt-6"
                  onClick={handleLogin}
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!loading && user) {
    route.push("/");
  }

  return <></>;
};

export default Login;
