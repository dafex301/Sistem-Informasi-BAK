import { Input } from "@material-tailwind/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import PageTitle from "../components/layout/PageTitle";
import { useAuth } from "../lib/authContext";

const Peminjaman: NextPage = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Peminjaman</title>
      </Head>
      <PageTitle title="Permohonan Peminjaman" />
      <main>
        <div className="grid grid-cols-12 mx-5 gap-5">
          <div className="flex flex-col col-span-8">
            <div className="w-full">
              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Nama Kegiatan
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="text"
                  placeholder="Nama Kegiatan"
                />
                <p className="text-gray-600 text-xs italic">
                  Make it as long and as crazy as you like
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-4 bg-blue-gray-100 p-5">
            <p className="font-semibold text-center text-sm mb-4">
              RINCIAN PELAKSANAAN PELAYANAN ADMINISTRASI PEMINJAMAN RUANG PKM
              DAN SC UNDIP
            </p>
            <ol className="list-decimal mx-5 gap-3 flex flex-col text-sm text-justify">
              <li>
                Pengurus Ormawa atau UKM yang akan menggunakan ruang yang ada di
                Gedung PKM Pleburan, PKM Tembalang atau Student Center, wajib
                mengajukan surat permohonan kepada Kepala Biro Akademik dan
                Kemahasiswaan dengan format surat bisa didownload di web Bagian
                Kemahasiswaan Undip.
              </li>
              <li>
                Proses persetujuan permohonan oleh Kepala BAK, Manager
                Kemahasiswaan, dan Supervisor Minarpresma.
              </li>
              <li>
                Tim BAK menghubungi mahasiswa yang bersangkutan untuk melengkapi
                Nota Peminjaman dan menyerahkan persyaratan peminjaman.
              </li>
              <li>
                Setelah Nota Peminjaman dan persyaratan disyahkan oleh
                Supervisor Minarpresma, Tim BAK mencatat dalam buku agenda
                peminjaman dan menghubungi Petugas Ruang PKM dan/atau SC
                setempat.
              </li>
              <li>
                Petugas Ruang PKM dan/atau SC mempersiapkan ruang dimaksud untuk
                proses penggunaan, dan mengunci kembali ruangan setelah selesai
                digunakan oleh Pengurus Ormawa dan/atau UKM.
              </li>
              <li>
                Mahasiswa WAJIB mematuhi semua peraturan peminjaman ruang yang
                ditetapkan oleh Pimpinan Universitas.
              </li>
              <li>
                Petugas Ruang DILARANG menyerahkan kunci kepada mahasiswa
                dengan alasan apapun.
              </li>
            </ol>
          </div>
        </div>
      </main>
    </>
  );
};

export default Peminjaman;
