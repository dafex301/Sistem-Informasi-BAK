import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { useRouter } from "next/router";
import PageBody from "../../../components/layout/PageBody";
import { convertLocalTime, roleAbbreviation } from "../../../lib/functions";
import { getSuratById, ISuratData } from "../../../firebase/surat";
import dynamic from "next/dynamic";
import Dialog from "@material-tailwind/react/components/Dialog";
import Image from "next/image";

const PDFViewer = dynamic(() => import("../../../components/PDFViewer"), {
  ssr: false,
});

const SuratDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // State
  const [data, setData] = useState<ISuratData | null | undefined>(null);
  const [openModal, setOpenModal] = useState(false);

  // Get data
  useEffect(() => {
    (async () => {
      setData(await getSuratById(id as string));
    })();
  }, [id]);

  return (
    <>
      <Head>
        <title>Surat {data?.perihal}</title>
      </Head>
      <PageTitle>Data Alur Surat</PageTitle>
      <PageBody>
        <div className="flex flex-col gap-5">
          <div>
            <div className="grid grid-cols-2 gap-4 place-content-between">
              <h2 className="font-medium mb-2 text-lg p-2">Detail Surat</h2>
              <div className="flex justify-end gap-4">
                <a
                  href={`https://wa.me/62${data?.kontak_pengirim}`}
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
            <div className="grid grid-cols-4 gap-y-5 bg-blue-50 p-5">
              <div>
                <h3 className="text-sm">Nomor Surat</h3>
                <p className="text-lg">{data?.nomor_surat}</p>
              </div>
              <div>
                <h3 className="text-sm">Tanggal Surat</h3>
                <p className="text-lg">
                  {data
                    ? convertLocalTime(data?.tanggal_surat.toString())
                    : "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Perihal</h3>
                <p className="text-lg">{data?.perihal}</p>
              </div>
              <div>
                <h3 className="text-sm">Tanggal Input</h3>
                <p className="text-lg">
                  {data
                    ? convertLocalTime(
                        data?.created_at.toDate().toLocaleString(),
                        true
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm">Penerima</h3>
                <p className="text-lg">{data?.penerima}</p>
              </div>
              <div>
                <h3 className="text-sm"> Nama Pengirim</h3>
                <p className="text-lg">{data?.nama_pengirim}</p>
              </div>
              {data?.tipe_surat === "sekretaris" ? (
                <div>
                  <h3 className="text-sm"> Instansi Pengirim</h3>
                  <p className="text-lg">{data?.instansi_pengirim}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm"> NIM Pengirim</h3>
                  <p className="text-lg">{data?.nim_pengirim}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm">Nomor WA Pengirim</h3>
                <p className="text-lg">{data?.kontak_pengirim}</p>
              </div>
            </div>
            <div>
              <h2 className="mt-6 font-medium mb-2 text-lg">Log Surat</h2>
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Aktor</th>
                    <th>Nama</th>
                    <th>Disposisi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* For each data.paraf object, show td of data.paraf.waktu ?? '-', data.paraf[key] ,data.paraf.catatah ?? '-' */}
                  {/* if data.paraf.status === false, animate-pulse, bg-yellow-50. Else bg-green-50 */}
                  {/* sort by data.paraf.waktu */}

                  {data?.paraf &&
                    Object.keys(data.paraf)
                      .sort((a, b) => {
                        if (!data.paraf[a]!.waktu) return -1;
                        if (!data.paraf[b]!.waktu) return 1;

                        return (
                          data.paraf[b]!.waktu!.seconds -
                          data.paraf[a]!.waktu!.seconds
                        );
                      })
                      .map((key, idx) => {
                        return (
                          <tr
                            key={key}
                            className={`${
                              data.paraf[key]!.status
                                ? data.status === "Ditolak" && idx === 0
                                  ? "bg-red-50"
                                  : "bg-green-50"
                                : "bg-yellow-50 animate-pulse"
                            } px-5 py-2 text-center`}
                          >
                            <td className="px-5 py-2 ">
                              {data.paraf[key]!.waktu
                                ? convertLocalTime(
                                    data.paraf[
                                      key
                                    ]!.waktu!.toDate().toLocaleString(),
                                    true
                                  )
                                : "Diproses"}
                            </td>
                            <td className="px-5 py-2 ">
                              {roleAbbreviation(key)}
                            </td>
                            <td className="px-5 py-2 ">
                              {data.paraf[key]!.nama ?? "Diproses"}
                            </td>
                            <td className="px-5 py-2 ">
                              {data.paraf[key]!.catatan ?? "Diproses"}
                            </td>
                          </tr>
                        );
                      })}

                  {/* <tr className="bg-yellow-50 px-5 py-2 text-center animate-pulse">
                    <td className="px-5 py-2 ">-</td>
                    <td className="px-5 py-2 "></td>
                    <td className="px-5 py-2 ">Tolong ditindaklanjuti ke SM</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
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

export default SuratDetail;
