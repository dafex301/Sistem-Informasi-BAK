import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import { createAccount } from "../../firebase/account";
import Loading from "../../components/Loading";
import { useRouter } from "next/router";

type registerForm = {
  name: string;
  nim: string;
  email: string;
  password: string;
};

const nameRegex = /^[a-zA-Z '-]+$/;
const nimRegex = /^[0-9]+$/;

const Register: NextPage = () => {
  const { user, userData, loading } = useAuth();

  const [name, setName] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<registerForm>({
    name: "",
    nim: "",
    email: "",
    password: "",
  });
  const auth = getAuth();

  const route = useRouter();

  const handleRegister = async () => {
    setError({
      name: "",
      nim: "",
      email: "",
      password: "",
    });

    if (!name) {
      setError((error) => ({ ...error, name: "Nama tidak boleh kosong" }));
    } else if (!nameRegex.test(name)) {
      setError((error) => ({
        ...error,
        name: "Nama hanya boleh mengandung huruf",
      }));
    }

    if (!nim) {
      setError((error) => ({ ...error, nim: "NIM/NIP tidak boleh kosong" }));
    } else if (!nimRegex.test(nim)) {
      setError((error) => ({
        ...error,
        nim: "NIM/NIP hanya boleh mengandung angka",
      }));
    }

    if (!email) {
      setError((error) => ({ ...error, email: "Email tidak boleh kosong" }));
    } else if (!email.includes("@")) {
      setError((error) => ({
        ...error,
        email: "Email tidak valid",
      }));
    }

    if (!password) {
      setError((error) => ({
        ...error,
        password: "Password tidak boleh kosong",
      }));
    }

    if (!error.name && !error.nim && !error.email && !error.password) {
      try {
        createAccount(auth, email, password, name, nim, "mahasiswa");
      } catch (e: any) {
        const errorCode = e.code;
        const errorMessage = e.message;
        console.log("error", error);
      }
    }
  };

  if (user) {
    route.push("/");
  }

  if (!loading && !user) {
    return (
      <>
        <Head>
          <title>Register</title>
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
              {/* Name */}
              <input
                className={
                  error.name
                    ? " rounded-[4px] mb-1 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 border-red-500"
                    : ` rounded-[4px] mb-5 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500`
                }
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
              />
              {error.name && (
                <p className="text-red-500 mb-3 text-xs">{error.name}</p>
              )}

              {/* NIM/NIP */}
              <input
                className={
                  error.nim
                    ? " rounded-[4px] mb-1 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 border-red-500"
                    : ` rounded-[4px] mb-5 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500`
                }
                type="number"
                placeholder="NIM/NIP"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                name="nim"
              />
              {error.nim && (
                <p className="text-red-500 mb-3 text-xs">{error.nim}</p>
              )}

              {/* Email */}
              <input
                className={
                  error.email
                    ? " rounded-[4px] mb-1 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 border-red-500"
                    : ` rounded-[4px] mb-5 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500`
                }
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
              {error.email && (
                <p className="text-red-500 mb-3 text-xs">{error.email}</p>
              )}

              {/* Password */}
              <input
                className={
                  error.password
                    ? " rounded-[4px] mb-1 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 border-red-500"
                    : ` rounded-[4px] mb-5 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500`
                }
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />
              {error.password && (
                <p className="text-red-500 mb-3 text-xs">{error.password}</p>
              )}
            </div>
            <button
              className="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 duration-300"
              onClick={handleRegister}
            >
              Daftar
            </button>
            <div className="mt-5 flex justify-between text-sm text-gray-600">
              <div></div>
              <div>
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="hover:underline">
                  Masuk
                </Link>
              </div>
            </div>
            <div className="mt-5 flex text-center text-sm text-gray-400">
              <p>
                Jika terdapat pertanyaan seputar sistem dapat menghubungi
                <br />
                <a
                  href="https://instagram.com/dafex30"
                  target={"_blank"}
                  className="underline"
                  rel="noreferrer"
                >
                  @dafex30
                </a>{" "}
                via instagram.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <Loading />;
};

export default Register;
