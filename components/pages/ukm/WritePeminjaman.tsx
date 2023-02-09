import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/authContext";

import Input from "../../forms/Input";
import Select from "../../forms/Select";
import DragDropFile from "../../forms/DragDropFile";
import { getFileName, uploadFile } from "../../../firebase/file";
import {
  checkWaktuPeminjamanAvailable,
  editPeminjaman,
  writePeminjaman,
} from "../../../firebase/peminjaman";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import SelectTempat from "../../forms/SelectTempat";

interface IPeminjamanProposalProps {
  type?: "new" | "update" | "revision";
  data?: DocumentData | null;
  id?: string;
}

const WritePeminjaman: NextPage<IPeminjamanProposalProps> = (props) => {
  const { user, loading } = useAuth();
  const route = useRouter();

  // State
  const [kegiatan, setKegiatan] = useState<string>("");
  const [errorKegiatan, setErrorKegiatan] = useState<string>("");

  const [jenisPinjaman, setJenisPinjaman] = useState<string>("");
  const [errorJenisPinjaman, setErrorJenisPinjaman] = useState<string>("");

  const [waktuPinjam, setWaktuPinjam] = useState<string>("");
  const [errorWaktuPinjam, setErrorWaktuPinjam] = useState<string>("");

  const [waktuKembali, setWaktuKembali] = useState<string>("");
  const [errorWaktuKembali, setErrorWaktuKembali] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState<string>("");

  const [fileUrl, setFileUrl] = useState<string>("");

  const handleSubmit = async (type: IPeminjamanProposalProps["type"]) => {
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
      setErrorWaktuPinjam("Waktu pinjam tidak boleh kosong");
    } else {
      setErrorWaktuPinjam("");
    }

    if (!waktuKembali) {
      setErrorWaktuKembali("Waktu kembali tidak boleh kosong");
    } else {
      setErrorWaktuKembali("");
    }

    if (props.type === "new") {
      if (!file) {
        setErrorFile("File tidak boleh kosong");
      } else {
        setErrorFile("");
      }
    }

    if (waktuPinjam && waktuKembali) {
      if (waktuPinjam >= waktuKembali) {
        setErrorWaktuPinjam(
          "Waktu kembali tidak boleh lebih dahulu dari waktu pinjam"
        );
        setErrorWaktuKembali(
          "Waktu kembali tidak boleh lebih dahulu dari waktu pinjam"
        );
        return;
      } else {
        setErrorWaktuPinjam("");
        setErrorWaktuKembali("");
      }

      if (
        props.type === "new" &&
        (await checkWaktuPeminjamanAvailable(
          new Date(waktuPinjam),
          new Date(waktuKembali),
          jenisPinjaman
        ))
      ) {
        setErrorWaktuKembali("");
        setErrorWaktuPinjam("");
      } else if (
        props.type !== "new" &&
        (await checkWaktuPeminjamanAvailable(
          new Date(waktuPinjam),
          new Date(waktuKembali),
          jenisPinjaman,
          props.id
        ))
      ) {
        console.log("update and available");
        setErrorWaktuKembali("");
        setErrorWaktuPinjam("");
      } else {
        setErrorWaktuKembali("Tempat sudah dipinjam pada waktu tersebut");
        setErrorWaktuPinjam("Tempat sudah dipinjam pada waktu tersebut");
        return;
      }
    }

    if (kegiatan && jenisPinjaman && waktuPinjam && waktuKembali) {
      // try {
      //   if (file) {
      //     uploadFile("permohonan_peminjaman", file, setFileUrl);
      //   } else {
      //     editPeminjaman(
      //       props.type == "revision" ? "revision" : "update",
      //       props.id!,
      //       kegiatan,
      //       jenisPinjaman,
      //       new Date(waktuPinjam),
      //       new Date(waktuKembali)
      //     );
      //     route.push(
      //       {
      //         pathname: "/ukm/peminjaman",
      //         query: { success: "Berhasil mengubah permohonan peminjaman" },
      //       },
      //       "/ukm/peminjaman"
      //     );
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    }
  };

  useEffect(() => {
    if (fileUrl) {
      // Update or revision with file
      if (props.data?.kegiatan) {
        editPeminjaman(
          props.type == "revision" ? "revision" : "update",
          props.id!,
          kegiatan,
          jenisPinjaman,
          new Date(waktuPinjam),
          new Date(waktuKembali),
          fileUrl
        );
        route.push(
          {
            pathname: "/ukm/peminjaman",
            query: { success: "Berhasil mengubah permohonan peminjaman" },
          },
          "/ukm/peminjaman"
        );
      } else {
        writePeminjaman({
          jenis_pinjaman: jenisPinjaman,
          kegiatan,
          waktu_pinjam: new Date(waktuPinjam),
          waktu_kembali: new Date(waktuKembali),
          file: fileUrl,
        });
        route.push(
          {
            pathname: "/ukm/peminjaman",
            query: { success: "Berhasil membuat permohonan peminjaman" },
          },
          "/ukm/peminjaman"
        );
      }
    }
    setFileUrl("");
  }, [
    fileUrl,
    jenisPinjaman,
    kegiatan,
    waktuPinjam,
    waktuKembali,
    props.data?.kegiatan,
    props.id,
    props.type,
    route,
  ]);

  // If update or revision, set state from props
  useEffect(() => {
    if (props.data?.kegiatan) {
      setKegiatan(props.data?.kegiatan);
      setJenisPinjaman(props.data?.jenis_pinjaman);
      setWaktuPinjam(props.data?.waktu_pinjam.toDate().toString());
      setWaktuKembali(props.data?.waktu_kembali.toDate().toString());
    }

    // TODO: CONVERT

    console.log(props.data?.waktu_pinjam.toDate().toISOString().slice(0, 16));
    console.log(props.data?.waktu_kembali.toDate());
  }, [props.data]);

  return (
    <>
      <main className="mx-5">
        {/* Main Form */}
        <div className="grid grid-cols-12 gap-5">
          {/* Input Section */}
          <div className="flex flex-col col-span-8 gap-4">
            {/* Rejected Reason */}
            {props.data?.rejected_reason && (
              <div className="bg-yellow-100 p-3 flex items-center gap-2 rounded-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-yellow-700"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>

                <p>{props.data!.rejected_reason}</p>
              </div>
            )}
            <Input
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
              error={errorKegiatan}
              label="Nama Kegiatan"
              id="nama-kegiatan"
            />
            <SelectTempat
              value={jenisPinjaman}
              onChange={(e) => setJenisPinjaman(e.target.value)}
              error={errorJenisPinjaman}
              label="Jenis Pinjaman"
              id="jenis-pinjaman"
            />

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
              filetype={[".pdf"]}
              maxSize={512000}
              file={file}
              error={errorFile}
              uploader={user?.claims.name}
              name={kegiatan}
              oldFileName={getFileName(props.data?.file) ?? ""}
            />

            <button
              onClick={() => handleSubmit(props.type)}
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

export default WritePeminjaman;
