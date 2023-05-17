import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DragDropFile from "../../../components/forms/DragDropFile";
import Input from "../../../components/forms/Input";
import Select from "../../../components/forms/Select";
import PageBody from "../../../components/layout/PageBody";
import PageTitle from "../../../components/layout/PageTitle";
import { uploadFile } from "../../../firebase/file";
import { useAuth } from "../../../lib/authContext";

import {
  createSurat,
  deleteSurat,
  getSuratByNomorSurat,
  ISurat,
  ISuratData,
} from "../../../firebase/surat";
import { Dialog } from "@material-tailwind/react";
import { ModalWithImage } from "../../../components/modal/Modal";

const CreateSuratPage: NextPage = () => {
  const { user, loading } = useAuth();
  const route = useRouter();

  const [nomorSurat, setNomorSurat] = useState<string>("");
  const [errorNomorSurat, setNomorErrorSurat] = useState<string>("");

  const [tanggalSurat, setTanggalSurat] = useState<string>("");
  const [errorTanggalSurat, setErrorTanggalSurat] = useState("");

  const [perihal, setPerihal] = useState<string>("");
  const [errorPerihal, setErrorPerihal] = useState<string>("");

  const [penerima, setPenerima] = useState<string>("");
  const [errorPenerima, setErrorPenerima] = useState<string>("");

  const [lainnya, setLainnya] = useState<string>("");
  const [errorLainnya, setErrorLainnya] = useState<string>("");

  const [namaPengirim, setNamaPengirim] = useState<string>("");
  const [errorNamaPengirim, setErrorNamaPengirim] = useState<string>("");

  const [instansiPengirim, setInstansiPengirim] = useState<string>("");
  const [errorInstansiPengirim, setErrorInstansiPengirim] =
    useState<string>("");

  const [kontakPengirim, setKontakPengirim] = useState<string>("");
  const [errorKontakPengirim, setErrorKontakPengirim] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState<string>("");

  const [fileUrl, setFileUrl] = useState<string>("");

  const [modal, setModal] = useState<[string, ISuratData | undefined]>([
    "",
    undefined,
  ]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    if (route.isFallback) return;

    e.preventDefault();

    let error: boolean = false;

    if (nomorSurat == "") {
      error = true;
      setNomorErrorSurat("Nomor Surat tidak boleh kosong");
    } else {
      setNomorErrorSurat("");
    }

    if (!tanggalSurat) {
      error = true;
      setErrorTanggalSurat("Tanggal Surat tidak boleh kosong");
    } else {
      setErrorTanggalSurat("");
    }

    if (!perihal) {
      error = true;
      setErrorPerihal("Perihal tidak boleh kosong");
    } else {
      setErrorPerihal("");
    }

    if (!penerima) {
      error = true;
      setErrorPenerima("Penerima tidak boleh kosong");
    } else {
      setErrorPenerima("");
      if (penerima === "lainnya") {
        if (!lainnya) {
          error = true;
          setErrorLainnya("Penerima tidak boleh kosong");
        } else {
          setErrorLainnya("");
        }
      }
    }

    if (!namaPengirim) {
      error = true;
      setErrorNamaPengirim("Nama Pengirim tidak boleh kosong");
    } else {
      setErrorNamaPengirim("");
    }

    if (!instansiPengirim) {
      error = true;
      setErrorInstansiPengirim(
        'Instansi Pengirim tidak boleh kosong. Isi "-" jika tidak ada'
      );
    } else {
      setErrorInstansiPengirim("");
    }

    if (!kontakPengirim) {
      error = true;
      setErrorKontakPengirim("Kontak Pengirim (WA) tidak boleh kosong");
    } else if (isNaN(Number(kontakPengirim))) {
      error = true;
      ``;
      setErrorKontakPengirim("Kontak Pengirim harus berupa angka");
    } else if (!kontakPengirim.startsWith("08")) {
      error = true;
      setErrorKontakPengirim("Kontak Pengirim harus diawali dengan 08");
    } else {
      setErrorKontakPengirim("");
    }

    if (!file) {
      error = true;
      setErrorFile("File tidak boleh kosong");
    }

    if (!error) {
      try {
        await getSuratByNomorSurat(nomorSurat).then((surat) => {
          if (surat) {
            setModal(["replace", surat]);
            console.log(surat);
            return;
          } else {
            uploadFile("surat", file!, setFileUrl);
            return;
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleReplace = async () => {
    await deleteSurat(modal[1]!).then(() => {
      uploadFile("surat", file!, setFileUrl);
    });
    setModal(["", undefined]);
  };

  // Submit if fileUrl is available
  // TODO
  useEffect(() => {
    if (fileUrl) {
      const suratRequest: ISurat = {
        nomor_surat: nomorSurat,
        tanggal_surat: tanggalSurat,
        perihal: perihal,
        penerima: penerima === "lainnya" ? lainnya : penerima,
        tipe_surat: "sekretaris",
        nama_pengirim: namaPengirim,
        instansi_pengirim: instansiPengirim,
        kontak_pengirim: kontakPengirim,
        file: fileUrl,
      };

      createSurat(suratRequest, true);

      route.push("/staff/surat/monitoring");
    }
  }, [fileUrl]);

  return (
    <>
      <Head>
        <title>Buat Surat</title>
      </Head>

      <PageTitle>Buat Surat</PageTitle>
      <PageBody>
        <form action="" onSubmit={handleSubmit}>
          <div className="flex flex-col col-span-8 gap-4">
            <Input
              required
              label={"Nomor Surat"}
              error={errorNomorSurat}
              onChange={(e) => setNomorSurat(e.target.value)}
              id={"no-surat"}
              value={nomorSurat}
            />
            <Input
              required
              label={"Tanggal Surat"}
              error={errorTanggalSurat}
              onChange={(e) => setTanggalSurat(e.target.value)}
              id={"tanggal-surat"}
              value={tanggalSurat}
              type={"date"}
            />
            <Input
              required
              label={"Perihal"}
              error={errorPerihal}
              onChange={(e) => setPerihal(e.target.value)}
              id={"perihal"}
              value={perihal}
            />
            <Select
              required
              label="Penerima"
              error={errorPenerima}
              onChange={(e) => setPenerima(e.target.value)}
              id={"penerima"}
            >
              <option value="">Pilih Penerima</option>
              <option value="Rektor">Rektor</option>
              <option value="WR1">Wakil Rektor 1</option>
              <option value="WR2">Wakil Rektor 2</option>
              <option value="WR3">Wakil Rektor 3</option>
              <option value="WR4">Wakil Rektor 4</option>
              <option value="lainnya">Lainnya</option>
            </Select>

            {penerima === "lainnya" && (
              <Input
                required
                label={"Penerima Lainnya"}
                error={errorLainnya}
                onChange={(e) => setLainnya(e.target.value)}
                id={"penerima-lainnya"}
                value={lainnya}
              />
            )}

            <div className=" grid grid-cols-2 gap-3">
              <Input
                required
                label={"Nama atau Jabatan Pengirim"}
                error={errorNamaPengirim}
                onChange={(e) => setNamaPengirim(e.target.value)}
                id={"nama-pengirim"}
                value={namaPengirim}
              />
              <Input
                required
                label={"Instansi Pengirim"}
                error={errorInstansiPengirim}
                onChange={(e) => setInstansiPengirim(e.target.value)}
                id={"instansi-pengirim"}
                value={instansiPengirim}
              />
            </div>
            <Input
              required
              type="tel"
              label={"Nomor WA Pengirim"}
              error={errorKontakPengirim}
              onChange={(e) => setKontakPengirim(e.target.value)}
              id={"kontak-pengirim"}
              value={kontakPengirim}
            />
            <DragDropFile
              setFile={setFile}
              setErrorFile={setErrorFile}
              label="Scan Surat"
              filetype={[".pdf"]}
              maxSize={512000}
              file={file}
              error={errorFile}
              uploader={namaPengirim}
              name={perihal}
              oldFileName={""}
              required
            />
            <button
              onClick={(e) => handleSubmit(e)}
              className="bg-black text-white rounded py-3 px-4 mt-3 hover:bg-gray-900"
            >
              Submit
            </button>
          </div>
        </form>
      </PageBody>

      <Dialog
        open={Boolean(modal[0])}
        handler={() => setModal(["", undefined])}
        className="overflow-auto min-w-min w-auto"
      >
        <ModalWithImage
          cancelHandler={setModal}
          mainHandler={handleReplace}
          image={"/assets/document-approve.jpeg"}
          name={"Surat"}
          color={"green"}
          mainText={"Ganti"}
        >
          <div className="text-sm">
            <p className="font-semibold text-gray-900 text-center">
              Surat dengan nomor ini sudah ada, apakah anda ingin mengganti
              surat yang sebelumnya?
            </p>
            <table className="text-gray-700 table-auto mt-3 mx-auto border-separate border-spacing-x-3">
              <tr className="w-10">
                <td>Nomor Surat</td>
                <td>:</td>
                <td className="">{modal[1]?.nomor_surat}</td>
              </tr>
              <tr>
                <td>Pengirim</td>
                <td>:</td>
                <td>{modal[1]?.nama_pengirim}</td>
              </tr>
              <tr>
                <td>Perihal</td>
                <td>:</td>
                <td>{modal[1]?.perihal}</td>
              </tr>
              <tr>
                <td>Dikirim pada</td>
                <td>:</td>
                <td>{modal[1]?.created_at.toDate().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>{modal[1]?.created_at.toDate().toLocaleTimeString()}</td>
              </tr>
            </table>
          </div>
        </ModalWithImage>
      </Dialog>
    </>
  );
};

export default CreateSuratPage;
