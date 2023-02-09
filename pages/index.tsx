import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import VerticalBarChart from "../components/charts/vertical-bar/VerticalBarChart";
import PageBody from "../components/layout/PageBody";
import PageTitle from "../components/layout/PageTitle";
import { getTotalPeminjaman, getTotalUser } from "../firebase/dashboard";
import { useAuth } from "../lib/authContext";

const Home: NextPage = () => {
  const { user, loading } = useAuth();

  const [peminjamanTotal, setPeminjamanTotal] = useState<number | null>(null);
  const [userTotal, setUserTotal] = useState<number | null>(null);

  useEffect(() => {
    if (peminjamanTotal === null) {
      (async () => {
        setPeminjamanTotal(await getTotalPeminjaman());
      })();
    }
  });

  useEffect(() => {
    if (userTotal === null) {
      (async () => {
        setUserTotal(await getTotalUser());
      })();
    }
  });

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageTitle>Dashboard</PageTitle>
      <PageBody>
        <div className="grid grid-cols-4 gap-8">
          <Link
            href={
              user?.claims.role === "admin"
                ? "/admin/peminjaman"
                : "/staff/peminjaman/data"
            }
          >
            <div className="flex flex-col bg-blue-100 rounded-lg p-5 gap-1 hover:bg-blue-200 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                />
              </svg>

              <p className="text-xl mt-5 font-medium">Permohonan Peminjaman</p>
              <p className="text-4xl font-bold">{peminjamanTotal ?? 0}</p>
            </div>
          </Link>
          <div className="flex flex-col bg-green-100 rounded-lg p-5 gap-1 hover:bg-green-200 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>

            <p className="text-xl mt-5 font-medium">Surat Menyurat</p>
            <p className="text-4xl font-bold">0</p>
          </div>
          <Link href="/admin/accounts">
            <div className="flex flex-col bg-yellow-100 rounded-lg p-5 gap-1 hover:bg-yellow-200 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>

              <p className="font-medium text-xl mt-5">User</p>
              <p className="text-4xl font-bold">{userTotal ?? 0}</p>
            </div>
          </Link>
          <Link href="/admin/tempat">
            <div className="flex flex-col bg-orange-100 rounded-lg p-5 gap-1 hover:bg-orange-200 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>

              <p className="font-medium text-xl mt-5">Tempat</p>
              <p className="text-4xl font-bold">{userTotal ?? 0}</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-12 mt-8 gap-8">
          <div className="grid grid-rows-3 gap-8 col-span-3">
            <div className="bg-pink-50 p-5">
              <h2>Permohonan Peminjaman Baru</h2>
              <p className="text-3xl">23</p>
            </div>
            <div className="bg-deep-orange-50 p-5">
              <h2>New Clients</h2>
              <h2>New Clients</h2>
            </div>
            <div className="bg-deep-orange-50 p-5">
              <h2>New Clients</h2>
              <h2>New Clients</h2>
            </div>
          </div>
          <div className="col-span-9 flex items-center justify-center shadow-lg rounded-lg p-5">
            <VerticalBarChart />
          </div>
        </div>
      </PageBody>
    </>
  );
};

export default Home;
