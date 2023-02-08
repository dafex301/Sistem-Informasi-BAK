import type { NextPage } from "next";
import Head from "next/head";
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
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col bg-green-50 rounded-lg p-5 gap-1">
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

            <p className="text-xl mt-5 font-medium">
              Jumlah Permohonan Peminjaman
            </p>
            <p className="text-4xl font-bold">{peminjamanTotal}</p>
          </div>
          <div className="flex flex-col bg-blue-50 rounded-lg p-5 gap-1">
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
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>

            <p className="text-xl mt-5 font-medium">Jumlah Proposal & Dana</p>
            <p className="text-4xl font-bold">963</p>
          </div>
          <div className="flex flex-col bg-yellow-50 rounded-lg p-5 gap-1">
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

            <p className="font-medium text-xl mt-5">Jumlah User</p>
            <p className="text-4xl font-bold">{userTotal}</p>
          </div>
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
