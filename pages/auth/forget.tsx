import { getAuth } from "firebase/auth";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { forgetPassword } from "../../firebase/account";
import { useAuth } from "../../lib/authContext";

type Props = {};

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const nimRegex = /^[0-9]+$/;

const Forget: NextPage = (props: Props) => {
  const { user, userData, loading } = useAuth();
  const route = useRouter();

  const [identifier, setIdentifier] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const auth = getAuth();

  const handleForget = async () => {
    setSuccess(null);
    setError("");
    if (!identifier) {
      setError("Email/NIM/NIP tidak boleh kosong");
      setSuccess(null);
    } else if (!emailRegex.test(identifier) && !nimRegex.test(identifier)) {
      setError("Email/NIM/NIP tidak valid");
      setSuccess(null);
    } else {
      try {
        await forgetPassword(auth, identifier).then(() => {
          setSuccess(true);
          setMessage("Silahkan cek email anda (Inbox/Spam).");
        });
      } catch (error: any) {
        setSuccess(false);
        setMessage(error.message);
      }
    }
  };

  if (!loading && !user) {
    return (
      <>
        <Head>
          <title>Forget Password</title>
          <link rel="icon" href="/undip.png" />
        </Head>
        {success !== null && (
          <div
            className={
              success
                ? "bg-green-200 border border-green-400 rounded-sm h-12 text-green-900 mb-5 flex items-center justify-center"
                : "bg-red-200 border border-red-400 rounded-sm h-12 text-red-900 mb-5 flex items-center justify-center"
            }
          >
            {message == "Firebase: Error (auth/missing-email)." ||
            message == "Firebase: Error (auth/user-not-found)."
              ? "Akun tidak ditemukan."
              : message}
          </div>
        )}

        <div className="flex flex-col text-sm rounded-md">
          <input
            className={
              error
                ? " rounded-[4px] mb-1 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 border-red-500"
                : ` rounded-[4px] mb-5 border p-3 hover:outline-none focus:outline-none hover:border-yellow-500`
            }
            type="text"
            placeholder={"Email/NIM/NIP"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            name="identifier"
          />
          {error && <div className="text-sm mb-5 text-red-500">{error}</div>}
        </div>
        <button
          onClick={handleForget}
          className="w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 duration-300"
        >
          Lupa Password
        </button>
        <div className="mt-5 flex justify-between text-sm text-gray-600">
          <Link href="/auth/login" className="hover:underline">
            Kembali ke halaman masuk
          </Link>
        </div>
      </>
    );
  }

  if (user) {
    route.push("/");
  }
  return <></>;
};

export default Forget;
