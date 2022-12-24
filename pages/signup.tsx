import type { NextPage } from "next";
import Head from "next/head";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../lib/authContext";
import { createAccount } from "../firebase/account";

const Home: NextPage = () => {
  const { user, userData, loading } = useAuth();
  const [name, setName] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (user) return <h1>U already logged</h1>;

  const auth = getAuth();

  const handleRegister = async () => {
    // Check if all field is filled
    if (!name || !nim || !email || !password || !confirmPassword) {
      setErrorMessage("Tolong isi semua data");
      return;
    }

    // Check if email is valid regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Email tidak valid");
      return;
    }

    // Check if name is valid and only contain alphabet
    const nameRegex = /^[a-zA-Z ]+$/;
    if (!nameRegex.test(name)) {
      setErrorMessage("Nama hanya boleh mengandung huruf dan spasi");
      return;
    }

    // Check if password is the same with confirmPassword
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password salah");
      return;
    }

    try {
      createAccount(auth, email, password, name, nim, "mahasiswa");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error", errorMessage);
    }
  };

  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <div className="container mx-auto">
        <div className="flex justify-center px-6 my-12">
          {/* Row */}
          <div className="w-full xl:w-3/4 lg:w-11/12 flex shadow-xl">
            {/* Col */}
            <div
              className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
              style={{
                backgroundImage:
                  'url("https://source.unsplash.com/Mv9hjnEUHR4/600x800")',
              }}
            />
            {/* Col */}
            <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
              <h3 className="pt-4 text-2xl text-center">Create an Account!</h3>
              {/* Error Message */}
              {errorMessage && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 mx-7 py-3 rounded relative my-4"
                  role="alert"
                >
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{errorMessage}</span>
                </div>
              )}
              <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="name"
                  >
                    Nama
                  </label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Nama"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="nim"
                  >
                    NIM/NIP
                  </label>
                  <input
                    onChange={(e) => setNim(e.target.value)}
                    value={nim}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="nim"
                    type="number"
                    placeholder="NIM/NIP"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="******************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="c_password"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="c_password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="******************"
                    />
                  </div>
                </div>
                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleRegister}
                  >
                    Register Account
                  </button>
                </div>
                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    href="./index.html"
                  >
                    Already have an account? Login!
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
