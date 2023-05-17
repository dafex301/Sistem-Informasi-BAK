import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAllPeminjaman,
  IPeminjamanData,
} from "../../../firebase/peminjaman";
import { getAllSurat, ISuratData } from "../../../firebase/surat";
import { useAuth } from "../../../lib/authContext";
import {
  peminjamanMonthly,
  peminjamanRecap,
  peminjamanVerify,
} from "../../../lib/dashboard";
import VerticalBarChart from "../../charts/vertical-bar/VerticalBarChart";

export default function StaffDashboard(props: any) {
  const { user, loading } = useAuth();
  const role = user?.claims.role;

  const [peminjamanData, setPeminjamanData] = useState<IPeminjamanData[]>([]);
  const [suratData, setSuratData] = useState<ISuratData[]>([]);

  // Peminjaman
  const { diproses, ditolak, disetujui } = peminjamanRecap(peminjamanData);
  const verify = peminjamanVerify(peminjamanData, user?.claims.role);

  // Surat
  const [surat, setSurat] = useState({
    masuk: 0,
  });

  useEffect(() => {
    let masuk = 0;

    suratData.forEach((item) => {
      if (item.paraf[role]?.status === false) {
        masuk++;
      }
     
    });

    setSurat((prevSurat) => ({
      ...prevSurat,
      masuk,
    }));
  }, [role, suratData]);

  useEffect(() => {
    setSurat((prevSurat) => ({
      ...prevSurat,
    }));
  }, [ surat.masuk]);

  useEffect(() => {
    (async () => {
      setPeminjamanData(await getAllPeminjaman());
      setSuratData(await getAllSurat());
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
          <Link href="/staff/peminjaman/verifikasi">
            <div className="bg-gray-100 hover:bg-gray-200 rounded-md p-5">
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
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                />
              </svg>

              <h1 className="mt-5 text-lg font-semibold">
                Verifikasi Peminjaman
              </h1>
              <h2 className="text-2xl font-semibold">{verify ?? 0}</h2>
            </div>
          </Link>
          <Link href={"/staff/peminjaman"}>
            <div className="flex flex-col shadow-sm bg-gray-100 rounded-lg p-5 hover:bg-gray-200 transition-all">
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
              <h2 className="mt-2 text-lg font-semibold">Peminjaman Tempat</h2>
              <div className="flex items-center justify-between">
                <p className="text-md">Diproses</p>
                <p className="text-md font-semibold">{diproses ?? 0}</p>
              </div>

              <div className="flex items-center justify-between ">
                <p className="text-md">Ditolak</p>
                <p className="text-md font-semibold">{ditolak ?? 0}</p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-md">Disetujui</p>
                <p className="text-md font-semibold">{disetujui ?? 0}</p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-md">Total</p>
                <p className="text-md font-semibold">
                  {peminjamanData.length ?? 0}
                </p>
              </div>
            </div>
          </Link>
          <Link href={"/peminjaman/kalender"} className="col-span-2">
            <div className="flex flex-col h-full shadow-sm bg-gray-100 rounded-lg p-5 hover:bg-gray-200 transition-all">
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>

              <h2 className="mt-2 text-lg font-semibold">
                Kalender Peminjaman
              </h2>
              <p className="text-sm">
                Lihat jadwal kegiatan peminjaman tempat yang telah diajukan
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
          <Link href="/staff/surat/masuk">
            <div className="bg-gray-100 hover:bg-gray-200 rounded-md p-5">
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
                  d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                />
              </svg>

              <h1 className="mt-5 text-lg font-semibold">Surat Masuk</h1>
              <h2 className="text-2xl font-semibold">{surat.masuk}</h2>
            </div>
          </Link>
          <div className="col-span-2 lg:col-span-1">
            <div className="flex flex-col shadow-sm bg-gray-100 rounded-lg p-5 hover:bg-gray-200 transition-all">
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
              <h2 className="mt-2 text-lg font-semibold">Surat Menyurat</h2>

              <div className="flex items-center justify-between ">
                <p className="text-md">Masuk</p>
                <p className="text-md font-semibold">{surat.masuk}</p>
              </div>

            </div>
          </div>
        </div>
        <div className="col-span-2 bg-gray-50 flex items-center justify-center p-5 rounded-md h-min">
          <VerticalBarChart
            title={"Permohonan dan Surat"}
            dataPermohonan={peminjamanMonthly(peminjamanData)}
            dataSurat={[]}
          />
        </div>
      </div>
    </>
  );
}
