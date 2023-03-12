import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { useAuth } from "../../../lib/authContext";
import { useRouter } from "next/router";
import PageBody from "../../../components/layout/PageBody";
// import {
//   getLogPeminjamanById,
//   getPeminjamanById,
// } from "../../firebase/peminjaman";
import { DocumentData } from "firebase/firestore";
import { actionTranslation, roleAbbreviation } from "../../../lib/functions";

const SuratDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();

  // State
  const [data, setData] = useState<DocumentData | null>(null);
  const [logData, setLogData] = useState<DocumentData | null>(null);

  // Get data

  return (
    <>
      <Head>
        <title>Data Alur Surat</title>
      </Head>
      <PageTitle>Data Alur Surat</PageTitle>
      <PageBody>
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-medium mb-2 text-lg">Detail Surat</h2>
            <div className="grid grid-cols-5 bg-blue-50 p-5">
              <div>
                <h3 className="text-sm">Nomor Surat</h3>
                <p className="text-lg"></p>
              </div>
              <div>
                <h3 className="text-sm">Tanggal Surat</h3>
                <p className="text-lg"></p>
              </div>
              <div>
                <h3 className="text-sm">Perihal</h3>
                <p className="text-lg"></p>
              </div>
              <div>
                <h3 className="text-sm">Tanggal Input</h3>
                <p className="text-lg"></p>
              </div>
              <div>
                <h3 className="text-sm">Penerima Surat</h3>
                <p className="text-lg"></p>
              </div>
            </div>
            <div>
              <h2 className="mt-6 font-medium mb-2 text-lg">Log Surat</h2>
              <table className="w-full border-seperate border-spacing-y-4">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Penerima saat ini</th>
                    <th>Nama</th>
                    <th>Disposisi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-yellow-50 px-5 py-2 text-center animate-pulse">
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">User</td>
                    <td className="px-5 py-2 "></td>
                    <td className="px-5 py-2 ">Tolong ditindaklanjuti ke SM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
};

export default SuratDetail;
