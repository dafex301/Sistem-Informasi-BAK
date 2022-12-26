import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useAuth, UserData } from "../../lib/authContext";
import Loading from "../../components/Loading";
import { useRouter } from "next/router";
import { writeUserToDb } from "../../firebase/account";
import { setCookie } from "nookies";
import { createToken } from "../../lib/jwt/token";

type dataForm = {
  name: string;
  nim: string;
};

const nameRegex = /^[a-zA-Z '-]+$/;
const nimRegex = /^[0-9]+$/;

const Data: NextPage = () => {
  const { user, userData, loading, setUserData } = useAuth();

  const [name, setName] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [error, setError] = useState<dataForm>({
    name: "",
    nim: "",
  });
  const auth = getAuth();

  const route = useRouter();

  const handleData = async () => {
    setError({
      name: "",
      nim: "",
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

    if (!error.name && !error.nim) {
      try {
        await writeUserToDb(auth, name, nim).then(() => {
          const userData: UserData = {
            name: name,
            no_induk: nim,
            role: "mahasiswa",
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

  if (!loading && user && !userData) {
    return (
      <>
        <Head>
          <title>Data</title>
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
              <h2 className="text-sm text-center mt-5">
                Mohon lengkapi data di bawah ini
              </h2>
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
            </div>
            <button
              className="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 duration-300"
              onClick={handleData}
            >
              Daftar
            </button>
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

  if (user && userData) {
    route.push("/");
  }

  if (!loading && !user) {
    route.push("/auth/login");
  }

  return <Loading />;
};

export default Data;
