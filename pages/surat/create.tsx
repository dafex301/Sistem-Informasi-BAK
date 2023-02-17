import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import DragDropFile from "../../components/forms/DragDropFile";
import Input from "../../components/forms/Input";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import CreatePeminjaman from "../../components/pages/data/Peminjaman";
import { getFileName } from "../../firebase/file";
import { useAuth } from "../../lib/authContext";

const CreateSuratPage: NextPage = () => {
  const { user, loading } = useAuth();

  const [nomorSurat, setNomorSurat] = useState<string>("");
  const [errorNomorSurat, setNomorErrorSurat] = useState<string>("");

  const [tanggalSurat, setTanggalSurat] = useState<string>("");
  const [errorTanggalSurat, setErrorTanggalSurat] = useState("");

  const [perihal, setPerihal] = useState<string>("");
  const [errorPerihal, setErrorPerihal] = useState<string>("");

  const [penerima, setPenerima] = useState<string>("");
  const [errorPenerima, setErrorPenerima] = useState<string>("");

  const [namaPengirim, setNamaPengirim] = useState<string>("");
  const [errorNamaPengirim, setErrorNamaPengirim] = useState<string>("");

  const [nimPengirim, setNIMPengirim] = useState<string>("");
  const [errorNIMPengirim, setErrorNIMPengirim] = useState<string>("");

  const [prodiPengirim, setProdiPengirim] = useState<string>("");
  const [errorProdiPengirim, setErrorProdiPengirim] = useState<string>("");

  const [fakultasPengirim, setFakultasPengirim] = useState<string>("");
  const [errorFakultasPengirim, setErrorFakultasPengirim] =
    useState<string>("");

  const [kontakPengirim, setKontakPengirim] = useState<string>("");
  const [errorKontakPengirim, setErrorKontakPengirim] = useState<string>("");

  const [emailPengirim, setEmailPengirim] = useState<string>("");
  const [errorEmailPengirim, setErrorEmailPengirim] = useState<string>("");

  const [ormawaPengirim, setOrmawaPengirim] = useState<string>("");
  const [errorOrmawaPengirim, setErrorOrmawaPengirim] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState<string>("");

  const [fileUrl, setFileUrl] = useState<string>("");

  const handleSubmit = () => {};

  return (
    <>
      <Head>
        <title>Buat Surat</title>
      </Head>

      <PageTitle>Buat Surat</PageTitle>
      <PageBody>
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
          <Input
            required
            label={"Penerima"}
            error={errorPenerima}
            onChange={(e) => setPenerima(e.target.value)}
            id={"penerima"}
            value={penerima}
          />
          <div className=" grid grid-cols-2 gap-3">
            <Input
              label={"Nama Pengirim"}
              error={errorNamaPengirim}
              onChange={(e) => setNamaPengirim(e.target.value)}
              id={"nama-pengirim"}
              value={namaPengirim}
            />
            <Input
              label={"NIM Pengirim"}
              error={errorNIMPengirim}
              onChange={(e) => setNIMPengirim(e.target.value)}
              id={"nim-pengirim"}
              value={nimPengirim}
            />
          </div>
          <div className=" grid grid-cols-2 gap-3">
            <Input
              label={"Prodi Pengirim"}
              error={errorProdiPengirim}
              onChange={(e) => setProdiPengirim(e.target.value)}
              id={"prodi-pengirim"}
              value={prodiPengirim}
            />
            <Input
              label={"Fakultas Pengirim"}
              error={errorFakultasPengirim}
              onChange={(e) => setFakultasPengirim(e.target.value)}
              id={"fakultas-pengirim"}
              value={fakultasPengirim}
            />
          </div>
          <div className=" grid grid-cols-2 gap-3">
            <Input
              label={"Kontak Pengirim (nomor WA)"}
              error={errorKontakPengirim}
              onChange={(e) => setKontakPengirim(e.target.value)}
              id={"kontak-pengirim"}
              value={kontakPengirim}
            />
            <Input
              label={"Email Pengirim"}
              error={errorEmailPengirim}
              onChange={(e) => setEmailPengirim(e.target.value)}
              id={"email-pengirim"}
              value={emailPengirim}
            />
          </div>
          <Input
            label={"Ormawa Pengirim (jika ada)"}
            error={errorOrmawaPengirim}
            onChange={(e) => setOrmawaPengirim(e.target.value)}
            id={"ormawa-pengirim"}
            value={ormawaPengirim}
          />
          <DragDropFile
            setFile={setFile}
            setErrorFile={setErrorFile}
            label="Scan Permohonan Peminjaman"
            filetype={[".pdf"]}
            maxSize={512000}
            file={file}
            error={errorFile}
            uploader={user?.claims.name}
            name={nomorSurat}
            // oldFileName={getFileName(props.data?.file) ?? ""}
            oldFileName={""}
          />
          <button
            onClick={() => handleSubmit()}
            className="bg-black text-white rounded py-3 px-4 mt-3 hover:bg-gray-900"
          >
            Submit
          </button>
        </div>
      </PageBody>
    </>
  );
};

export default CreateSuratPage;
