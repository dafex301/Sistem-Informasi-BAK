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
import {
  actionTranslation,
  formatDateTime,
  roleAbbreviation,
} from "../../../lib/functions";
import Image from "next/image";
import { Dialog } from "@material-tailwind/react";
import PDFViewer from "../../../components/PDFViewer";

const PeminjamanDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();

  // State
  const [data, setData] = useState<DocumentData | null>(null);
  const [logData, setLogData] = useState<DocumentData | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        await getPeminjamanById(id as string).then((data) => {
          setData(data!);
        });
      })();
    }
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
        <title>Detail Peminjaman Tempat</title>
      </Head>
      <PageTitle>Detail Peminjaman Tempat</PageTitle>
      <PageBody>
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-semibold">{data?.kegiatan}</h1>
          <div>
            <div className="flex justify-between">
              <h2 className="font-medium mb-2 text-lg">Detail Kegiatan</h2>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/+62${data?.kontakPJ}`}
                  className="font-medium mb-2 text-lg bg-green-50 hover:bg-green-100 rounded-sm p-2 px-4 min-w-min flex gap-1 items-center"
                >
                  <Image
                    src="/assets/whatsapp.svg"
                    height={25}
                    width={25}
                    alt={"Whatsapp"}
                  />

                  <p>WA pengirim</p>
                </a>
                <button
                  onClick={() => setOpenModal(true)}
                  className="font-medium mb-2 text-lg bg-gray-200 hover:bg-gray-300 rounded-sm p-2 px-4 min-w-min flex gap-1 items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <p>Lihat surat</p>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 bg-blue-50 p-5 gap-y-5">
              <div>
                <h3 className="text-sm">Pemohon</h3>
                <p className="text-lg">{data?.pemohon.name}</p>
              </div>
              <div>
                <h3 className="text-sm">Tempat</h3>
                <p className="text-lg">{data?.jenis_pinjaman}</p>
              </div>
              <div>
                <h3 className="text-sm">Waktu Mulai</h3>
                <p className="text-lg">
                  {data ? formatDateTime(data?.waktu_pinjam.toDate()) : ""}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Waktu Selesai</h3>
                <p className="text-lg">
                  {data ? formatDateTime(data?.waktu_kembali.toDate()) : ""}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Penanggung Jawab</h3>
                <p className="text-lg">{data?.penanggungJawab}</p>
              </div>
              <div>
                <h3 className="text-sm">Contact Person</h3>
                <p className="text-lg">{data?.kontakPJ}</p>
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
                      {formatDateTime(L.log.waktu.toDate())}
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

      <Dialog
        open={openModal}
        handler={() => setOpenModal(false)}
        className="overflow-auto min-w-min w-auto"
      >
        <div className="h-[36rem]">
          <PDFViewer file={data?.file!} />
        </div>
      </Dialog>
    </>
  );
};

export default PeminjamanDetail;
