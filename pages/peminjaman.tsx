import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import PageTitle from "../components/layout/PageTitle";
import { useAuth } from "../lib/authContext";

import Input from "../components/forms/Input";
import Select from "../components/forms/Select";
import DateTimePicker from "../components/forms/DateTimePicker";
import DragDropFile from "../components/forms/DragDropFile";
import { uploadFile } from "../firebase/file";
import { writePeminjaman } from "../firebase/peminjaman";

const Peminjaman: NextPage = () => {
  const { user, loading } = useAuth();

  // State
  const [kegiatan, setKegiatan] = useState<string>("");
  const [errorKegiatan, setErrorKegiatan] = useState<string>("");

  const [jenisPinjaman, setJenisPinjaman] = useState<string>("");
  const [errorJenisPinjaman, setErrorJenisPinjaman] = useState<string>("");

  const [waktuPinjam, setWaktuPinjam] = useState<string>("");
  const [errorWaktuPinjam, seterrorWaktuPinjam] = useState<string>("");

  const [waktuKembali, setWaktuKembali] = useState<string>("");
  const [errorWaktuKembali, seterrorWaktuKembali] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState<string>("");

  const [fileUrl, setFileUrl] = useState<string>("");

  const handleSubmit = () => {
    if (!kegiatan) {
      setErrorKegiatan("Nama kegiatan tidak boleh kosong");
    } else {
      setErrorKegiatan("");
    }

    if (!jenisPinjaman) {
      setErrorJenisPinjaman("Jenis pinjaman tidak boleh kosong");
    } else {
      setErrorJenisPinjaman("");
    }

    if (!waktuPinjam) {
      seterrorWaktuPinjam("Waktu pinjam tidak boleh kosong");
    } else {
      seterrorWaktuPinjam("");
    }

    if (!waktuKembali) {
      seterrorWaktuKembali("Waktu kembali tidak boleh kosong");
    } else {
      seterrorWaktuKembali("");
    }

    if (waktuPinjam > waktuKembali) {
      seterrorWaktuPinjam(
        "Waktu kembali tidak boleh lebih dahulu dari waktu pinjam"
      );
      seterrorWaktuKembali(
        "Waktu kembali tidak boleh lebih dahulu dari waktu pinjam"
      );
    } else {
      seterrorWaktuPinjam("");
      seterrorWaktuKembali("");
    }

    if (!file) {
      setErrorFile("File tidak boleh kosong");
    } else {
      setErrorFile("");
    }

    if (kegiatan && jenisPinjaman && waktuPinjam && waktuKembali && file) {
      try {
        uploadFile("peminjaman", file, setFileUrl);
        writePeminjaman({
          jenis_pinjaman: jenisPinjaman,
          kegiatan,
          waktu_pinjam: new Date(waktuPinjam),
          waktu_kembali: new Date(waktuKembali),
          file: fileUrl,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Permohonan Peminjaman</title>
      </Head>
      <PageTitle title="Permohonan Peminjaman" />
      <main>
        <div className="grid grid-cols-12 mx-5 gap-5">
          {/* Input Section */}
          <div className="flex flex-col col-span-8 gap-4">
            <Input
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
              error={errorKegiatan}
              label="Nama Kegiatan"
              id="nama-kegiatan"
            />
            <Select
              value={jenisPinjaman}
              onChange={(e) => setJenisPinjaman(e.target.value)}
              error={errorJenisPinjaman}
              label="Jenis Pinjaman"
              id="jenis-pinjaman"
            >
              <option value="" disabled>
                Pilih Jenis Pinjaman
              </option>
              <option value="Halaman Depan Diponegoro (Parkir)">
                Halaman Depan Diponegoro (Parkir)
              </option>
              <option value="Belakang SC atau Gazebo (Barat)">
                Belakang SC atau Gazebo (Barat)
              </option>
              <option value="Belakang SC atau Gazebo (Tengah)">
                Belakang SC atau Gazebo (Tengah)
              </option>
              <option value="Belakang SC atau Gazebo (Timur)">
                Belakang SC atau Gazebo (Timur)
              </option>
            </Select>
            <div className="w-full grid grid-cols-12 gap-5">
              <div className="col-span-6">
                <Input
                  type="datetime-local"
                  value={waktuPinjam}
                  onChange={(e) => setWaktuPinjam(e.target.value)}
                  label="Waktu Pinjam"
                  id="Waktu-pinjam"
                  error={errorWaktuPinjam}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="datetime-local"
                  value={waktuKembali}
                  onChange={(e) => setWaktuKembali(e.target.value)}
                  label="Waktu Kembali"
                  id="Waktu-kembali"
                  error={errorWaktuKembali}
                />
              </div>
            </div>

            <DragDropFile
              setFile={setFile}
              setErrorFile={setErrorFile}
              label="Scan Permohonan Peminjaman"
              filetype={[".pdf", ".jpeg"]}
              maxSize={512000}
              file={file}
              error={errorFile}
              uploader={user?.claims.name}
              name={kegiatan}
            />

            <button
              onClick={handleSubmit}
              className="bg-black text-white rounded py-3 px-4 mt-3 hover:bg-gray-900"
            >
              Submit
            </button>
          </div>
          {/* End of Input Section */}

          {/* Right Section */}
          <div className="col-span-4 bg-blue-gray-100 p-5 text-gray-900 rounded">
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
          {/* End of Right Section */}
        </div>
      </main>
    </>
  );
};

export default Peminjaman;
