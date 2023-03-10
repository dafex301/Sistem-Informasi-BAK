import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { useAuth } from "../../../lib/authContext";
import { useRouter } from "next/router";
import PageBody from "../../../components/layout/PageBody";
import {
  getLogPeminjamanById,
  getPeminjamanById,
} from "../../../firebase/peminjaman";
import { DocumentData } from "firebase/firestore";
import { actionTranslation, roleAbbreviation } from "../../../lib/functions";

const PeminjamanDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();

  // State
  const [data, setData] = useState<DocumentData | null>(null);
  const [logData, setLogData] = useState<DocumentData | null>(null);

  useEffect(() => {
    (async () => {
      await getPeminjamanById(id as string).then((data) => {
        setData(data!);
      });
    })();
  }, [id]);

  useEffect(() => {
    if (id) {
      (async () => {
        await getLogPeminjamanById(id as string).then((data) => {
          setLogData(data);
        });
      })();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Permohonan Peminjaman Detail</title>
      </Head>
      <PageTitle>Permohonan Peminjaman Detail</PageTitle>
      <PageBody>
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-semibold">{data?.kegiatan}</h1>
          <div>
            <h2 className="font-medium mb-2 text-lg">Detail Kegiatan</h2>
            <div className="grid grid-cols-4 bg-blue-50 p-5">
              <div>
                <h3 className="text-sm">Pemohon</h3>
                <p className="text-lg">{data?.pemohon.name}</p>
              </div>
              <div>
                <h3 className="text-sm">Jenis Pinjaman</h3>
                <p className="text-lg">{data?.jenis_pinjaman}</p>
              </div>
              <div>
                <h3 className="text-sm">Waktu Pinjam</h3>
                <p className="text-lg">
                  {data?.waktu_pinjam.toDate().toLocaleString("id-ID")}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Waktu Kembali</h3>
                <p className="text-lg">
                  {data?.waktu_kembali.toDate().toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-medium mb-2 text-lg">Progress Surat</h2>
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Tahap</th>
                  <th>Nama</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {data?.rejected ? (
                  <tr className="bg-yellow-50 px-5 py-2 text-center animate-pulse">
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">User</td>
                    <td className="px-5 py-2 ">{data?.pemohon.name}</td>
                    <td className="px-5 py-2 ">Revisi</td>
                  </tr>
                ) : !data?.paraf_KBAK ? (
                  <tr className="bg-yellow-50 px-5 py-2 text-center animate-pulse">
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">Kepala BAK</td>
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">Diproses</td>
                  </tr>
                ) : !data?.paraf_MK ? (
                  <tr className="bg-yellow-50 px-5 py-2 text-center animate-pulse">
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">Manager Kemahasiswaan</td>
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">Diproses</td>
                  </tr>
                ) : !data.paraf_SM ? (
                  <tr className="bg-yellow-50 px-5 py-2 text-center animate-pulse">
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">Supervisor Minarpresma</td>
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 ">Diproses</td>
                  </tr>
                ) : (
                  <></>
                )}

                {logData?.map((L: any) => (
                  <tr
                    key={L.log.waktu.toDate().toLocaleString("id-ID")}
                    className={
                      L.log.aksi === "reject"
                        ? "bg-red-50 px-5 py-2 text-center"
                        : "bg-green-50 px-5 py-2 text-center"
                    }
                  >
                    <td className="px-5 py-2 ">
                      {L.log.waktu.toDate().toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-2 ">
                      {roleAbbreviation(L.log.user.role)}
                    </td>
                    <td className="px-5 py-2 ">{L.log.user.name}</td>
                    <td className="px-5 py-2 ">
                      <p>{actionTranslation(L.log.aksi)}</p>
                      <p>{L.log?.alasan}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Foreach logData */}
          </div>
        </div>
      </PageBody>
    </>
  );
};

export default PeminjamanDetail;
