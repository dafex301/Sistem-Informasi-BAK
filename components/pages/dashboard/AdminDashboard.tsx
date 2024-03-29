import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../../firebase/account";
import {
  comparePeminjaman,
  peminjamanMonthly,
  suratMonthly,
} from "../../../lib/dashboard";
import {
  IPeminjamanData,
  getAllPeminjaman,
} from "../../../firebase/peminjaman";
import { getAllTempat } from "../../../firebase/tempat";
import VerticalBarChart from "../../charts/vertical-bar/VerticalBarChart";
import PageBody from "../../layout/PageBody";
import { getAllSurat, ISuratData } from "../../../firebase/surat";

export default function AdminDashboard(props: any) {
  const [peminjamanData, setPeminjamanData] = useState<IPeminjamanData[]>([]);
  const [userData, setUserData] = useState<DocumentData[]>([]);
  const [suratData, setSuratData] = useState<ISuratData[]>([]);
  const [tempatData, setTempatData] = useState<DocumentData[]>([]);

  // Create a state that is will contain {total: number, percentage: number}
  const [peminjamanDataMonth, setPeminjamanDataMonth] = useState<{
    total: number;
    percentage: number;
  }>({ total: 0, percentage: 0 });

  // Fetch data
  useEffect(() => {
    (async () => {
      setPeminjamanData(await getAllPeminjaman());
      setUserData(await getAllUsers());
      setTempatData(await getAllTempat());
      setSuratData(await getAllSurat());
    })();
  }, []);

  // Calculate Data
  useEffect(() => {
    if (peminjamanData.length > 0) {
      // Calculate peminjamanDataMonth
      const peminjamanDataThisMonth = comparePeminjaman(peminjamanData);
      setPeminjamanDataMonth(peminjamanDataThisMonth);
    }
  }, [peminjamanData]);
  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
        <Link href={"/admin/peminjaman"}>
          <div className="flex flex-col shadow-sm bg-blue-100 rounded-lg p-5 gap-1 hover:bg-blue-200 transition-all">
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

            <p className="text-xl mt-5 font-medium">Total Peminjaman</p>
            <p className="text-4xl font-bold">{peminjamanData.length ?? 0}</p>
          </div>
        </Link>
        <div className="flex flex-col shadow-sm bg-green-100 rounded-lg p-5 gap-1 hover:bg-green-200 transition-all">
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

          <p className="text-xl mt-5 font-medium">Total Surat</p>
          <p className="text-4xl font-bold">{suratData.length}</p>
        </div>
        <Link href="/admin/accounts">
          <div className="flex flex-col shadow-sm bg-yellow-100 rounded-lg p-5 gap-1 hover:bg-yellow-200 transition-all">
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

            <p className="font-medium text-xl mt-5">Total Users</p>
            <p className="text-4xl font-bold">{userData.length ?? 0}</p>
          </div>
        </Link>
        <Link href="/admin/tempat">
          <div className="flex flex-col shadow-sm bg-orange-100 rounded-lg p-5 gap-1 hover:bg-orange-200 transition-all">
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

            <p className="font-medium text-xl mt-5">Total Tempat</p>
            <p className="text-4xl font-bold">{tempatData.length ?? 0}</p>
          </div>
        </Link>
      </div>

      <div className="grid md:grid-cols-9 lg:grid-cols-12 mt-8 gap-8">
        <div className="grid grid-rows-3 gap-8 md:col-span-3">
          <div className="bg-gray-100 shadow-sm rounded-lg p-5 flex flex-col justify-evenly">
            <h2 className="font-medium">Peminjaman Tempat Baru</h2>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-bold">{peminjamanDataMonth.total}</p>
              <div
                className={
                  peminjamanDataMonth.percentage >= 0
                    ? "flex items-center text-green-800 bg-green-100 px-2 rounded-md"
                    : "flex items-center text-red-800 bg-red-100 px-2 rounded-md"
                }
              >
                <p>{peminjamanDataMonth.percentage}%</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 3.75H19.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V6.31L5.03 20.03a.75.75 0 01-1.06-1.06L17.69 5.25H8.25a.75.75 0 010-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 shadow-sm rounded-lg p-5 flex flex-col justify-evenly">
            <h2 className="font-medium">Surat Menyurat Baru</h2>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-bold">4</p>
              <div className="flex items-center text-red-800 bg-red-100 px-2 rounded-md">
                <p>15%</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.97 3.97a.75.75 0 011.06 0l13.72 13.72V8.25a.75.75 0 011.5 0V19.5a.75.75 0 01-.75.75H8.25a.75.75 0 010-1.5h9.44L3.97 5.03a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <Link
            href="/peminjaman/calendar"
            className="bg-gray-100 shadow-sm rounded-lg p-5 flex justify-evenly items-center gap-2 hover:bg-gray-200 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10"
            >
              <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                clipRule="evenodd"
              />
            </svg>

            <h2 className="font-medium text-xl">Kalendar Peminjaman</h2>
          </Link>
        </div>
        <div className="md:col-span-9 flex items-center justify-center shadow-lg rounded-lg p-5">
          <VerticalBarChart
            title={"Data Permohonan dan Surat"}
            dataPermohonan={peminjamanMonthly(peminjamanData)}
            dataSurat={suratMonthly(suratData)}
          />
        </div>
      </div>
    </>
  );
}
