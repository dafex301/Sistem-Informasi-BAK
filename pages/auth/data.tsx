import type { NextPage } from "next";
import Head from "next/head";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth, UserData } from "../../lib/authContext";
import Loading from "../../components/Loading";
import { useRouter } from "next/router";
import { writeUserToDb } from "../../firebase/account";
import { setCookie } from "nookies";
import { createToken } from "../../lib/jwt/token";
import { AuthLayout } from "../../components/layout/AuthLayout";

type dataForm = {
  name: string;
  nim: string;
  password: string;
};

const nameRegex = /^[a-zA-Z '-]+$/;
const nimRegex = /^[0-9]+$/;

const Data: NextPage = () => {
  const { user, userData, loading, setUserData } = useAuth();

  const [name, setName] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<dataForm>({
    name: "",
    nim: "",
    password: "",
  });
  const auth = getAuth();

  const route = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.claims.name);
      setEmail(user.claims.email);
    }
  }, [user]);

  const handleData = async () => {
    setError({
      name: "",
      nim: "",
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

    if (!password) {
      setError((error) => ({
        ...error,
        password: "Password tidak boleh kosong",
      }));
    }

    if (!error.name && !error.nim) {
      try {
        await writeUserToDb(auth, name, nim, email, password, "Mahasiswa").then(() => {
          const userData: UserData = {
            name: name,
            no_induk: nim,
            role: "Mahasiswa",
          };
          createToken(userData)
            .then((jwt) => {
              setCookie(null, "user", jwt, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
              });
            })
            .then(() => {
              setUserData(userData);
            });
        });
      } catch (e: any) {
        const errorCode = e.code;
        const errorMessage = e.message;
        console.log("error", e);
      }
    }
  };

  if (user && !userData) {
    // setName(user.claims.name);
    return (
      <>
        <Head>
          <title>Data</title>
          <link rel="icon" href="/undip.png" />
        </Head>

        <div className="flex flex-col text-sm rounded-md">
          {/* Name */}
          <input
            className={`text-gray-500 rounded-[4px] mb-5 border p-3 hover:outline-none focus:outline-none`}
            type="text"
            value={email}
            name="email"
            disabled
          />
          {error.name && (
            <p className="text-red-500 mb-3 text-xs">{error.name}</p>
          )}
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

          {/* Password */}
          <input
            className={
              error.nim
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
          onClick={handleData}
        >
          Daftar
        </button>
      </>
    );
  }

  if (!loading && !user) {
    route.push("/auth/login");
  }

  return <Loading />;
};

export default Data;
