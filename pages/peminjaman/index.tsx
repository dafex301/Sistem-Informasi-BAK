import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import { useAuth } from "../../lib/authContext";

const PeminjamanIndex: NextPage = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Peminjaman Tempat</title>
      </Head>
      <PageTitle>Peminjaman Tempat</PageTitle>
      <PageBody>
        <div className="grid grid-cols-2 gap-10">
          <Link href={"/ormawa/peminjaman/create"}>
            <div className="flex flex-col bg-red-500 hover:bg-red-400 text-white min-w-max p-5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12"
              >
                <path d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                <path
                  fillRule="evenodd"
                  d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                  clipRule="evenodd"
                />
              </svg>

              <p className="text-2xl">Buat Peminjaman Tempat</p>
            </div>
          </Link>

          <Link href={"/ormawa/peminjaman/create"}>
            <div className="flex flex-col bg-blue-800 text-white min-w-max p-5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12"
              >
                <path d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                <path
                  fillRule="evenodd"
                  d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                  clipRule="evenodd"
                />
              </svg>

              <p className="text-2xl">Buat Peminjaman Tempat</p>
            </div>
          </Link>
        </div>
      </PageBody>
    </>
  );
};

export default PeminjamanIndex;
