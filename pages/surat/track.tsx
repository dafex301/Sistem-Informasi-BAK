import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import { useAuth } from "../../lib/authContext";

const Track: NextPage = () => {
  const { user, loading } = useAuth();
  const [nomorSurat, setNomorSurat] = useState("");
  const route = useRouter();
  const [error, setError] = useState({ nomorSurat: "" });

  const handleCariSurat = async () => {
    let error = false;
    if (nomorSurat === "") {
      setError({ nomorSurat: "Nomor surat tidak boleh kosong" });
      error = true;
    }

    if (!error) {
      // get the api from /api/surat/search
      // request body is { nomorSurat: nomorSurat }
      // if success, redirect to /surat/[id]
      // if failed, show error message
      await fetch("/api/surat/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomorSurat: nomorSurat }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            route.push(`/surat/detail/${data.id}`);
          } else {
            setError({ nomorSurat: "Nomor surat tidak ditemukan" });
          }
        });
    }
  };

  return (
    <>
      <Head>
        <title>Track Surat</title>
      </Head>
      <PageTitle title="Track Surat" />
      <PageBody>
        <p className="font-medium text-center mx-4 mb-2">
          Selamat datang pada halaman pelacakan surat pada BAK Undip. Silahkan
          input nomor surat yang hendak dilacak di kolom sebagai berikut:
        </p>

        <div className="flex justify-center">
          <Image
            src={"/assets/track-surat-fix.png"}
            width={2475}
            height={1529}
            alt={"Icon untuk tracking surat"}
            className="w-1/3"
          />
        </div>

        <div className="m-4">
          <div className="flex items-center flex-col justify-center ">
            <label
              htmlFor="large-input"
              className="block text-lg font-semibold text-gray-900 dark:text-white my-2"
            >
              Nomor Surat:
            </label>
            <input
              value={nomorSurat}
              onChange={(e) => setNomorSurat(e.target.value)}
              type="text"
              id="large-input"
              className="m-2 p-2 block w-full items-center text-center text-gray-900 bordeSr border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></input>
            {error.nomorSurat !== "" && (
              <p className="text-red-500 text-sm italic">{error.nomorSurat}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="block rounded-md bg-gray-300 hover:bg-gray-400 font-semibold m-2 px-4 py-3 "
            onClick={handleCariSurat}
          >
            Lacak
          </button>
        </div>
      </PageBody>
    </>
  );
};

export default Track;
