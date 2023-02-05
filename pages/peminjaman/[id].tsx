import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/router";
import PageBody from "../../components/layout/PageBody";
import {
  getLogPeminjamanById,
  getPeminjamanById,
} from "../../firebase/peminjaman";
import { DocumentData } from "firebase/firestore";

const PeminjamanDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();

  // State
  const [data, setData] = useState<DocumentData | null>(null);
  const [logData, setLogData] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (data === null && id) {
      (async () => {
        await getPeminjamanById(id as string).then((data) => {
          setData(data!);
        });
      })();
    }
  }, [data, id]);

  useEffect(() => {
    if (logData === null && id) {
      (async () => {
        await getLogPeminjamanById(id as string).then((data) => {
          setLogData(data);
        });
      })();
    }
  });

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
            <div className="grid grid-cols-4 text-center">
              <p>Waktu</p>
              <p>Tahap</p>
              <p>Aktor</p>
              <p>Keterangan</p>
            </div>
            {/* Foreach logData */}
            {logData?.map((L: any) => (
              <div
                key={L.log.waktu.toDate().toLocaleString("id-ID")}
                className="grid grid-cols-4 bg-green-50 px-5 py-2 text-center my-2"
              >
                <div>
                  <p className="">
                    {L.log.waktu.toDate().toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="">{L.log.user.role}</p>
                </div>
                <div>
                  <p className="">{L.log.user.name}</p>
                </div>
                <div>
                  <p className="">{L.log.aksi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
};

export default PeminjamanDetail;
