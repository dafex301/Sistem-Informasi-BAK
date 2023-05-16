import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import DragDropFile from "../../components/forms/DragDropFile";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import CreatePeminjaman from "../../components/pages/data/Peminjaman";
import { getFileName, uploadFile } from "../../firebase/file";
import { useAuth } from "../../lib/authContext";

import fakultas from "../../data/fakultas.json";
import jurusan from "../../data/jurusan.json";
import { createSurat, ISurat, ITebusan } from "../../firebase/surat";

const CreateSuratPage: NextPage = () => {
  const { user, loading } = useAuth();
  const route = useRouter();

  const ormawa = user?.claims.role === "UKM" ? user.claims.name : "";

  const [nomorSurat, setNomorSurat] = useState<string>("");
  const [errorNomorSurat, setNomorErrorSurat] = useState<string>("");

  const [tanggalSurat, setTanggalSurat] = useState<string>("");
  const [errorTanggalSurat, setErrorTanggalSurat] = useState("");

  const [perihal, setPerihal] = useState<string>("");
  const [errorPerihal, setErrorPerihal] = useState<string>("");

  const [penerima, setPenerima] = useState<string>("");
  const [errorPenerima, setErrorPenerima] = useState<string>("");

  const [tebusan, setTebusan] = useState<ITebusan>({
    KBAK: {
      status: false,
      view: false,
    },
    MK: {
      status: false,
      view: false,
    },
    SB: {
      status: false,
      view: false,
    },
    SK: {
      status: false,
      view: false,
    },
    SM: {
      status: false,
      view: false,
    },
  });
  const [errorTebusan, setErrorTebusan] = useState<string>("");

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

  const [ormawaPengirim, setOrmawaPengirim] = useState<string>(ormawa);
  const [errorOrmawaPengirim, setErrorOrmawaPengirim] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState<string>("");

  const [fileUrl, setFileUrl] = useState<string>("");

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
    }

    if (!namaPengirim) {
      error = true;
      setErrorNamaPengirim("Nama Pengirim tidak boleh kosong");
    } else {
      setErrorNamaPengirim("");
    }

    if (!nimPengirim) {
      error = true;
      setErrorNIMPengirim("NIM Pengirim tidak boleh kosong");
    } else {
      if (isNaN(Number(nimPengirim)) || nimPengirim.length != 14) {
        error = true;
        setErrorNIMPengirim("NIM harus 14 digit angka");
      } else {
        setErrorNIMPengirim("");
      }
    }

    if (!prodiPengirim) {
      error = true;
      setErrorProdiPengirim("Prodi Pengirim tidak boleh kosong");
    } else {
      setErrorProdiPengirim("");
    }

    if (!fakultasPengirim) {
      error = true;
      setErrorFakultasPengirim("Fakultas Pengirim tidak boleh kosong");
    } else {
      setErrorFakultasPengirim("");
    }

    if (!kontakPengirim) {
      error = true;
      setErrorKontakPengirim("Kontak Pengirim (WA) tidak boleh kosong");
    } else if (isNaN(Number(kontakPengirim))) {
      error = true;
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
        if (file) {
          uploadFile("surat", file, setFileUrl);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Submit if fileUrl is available
  useEffect(() => {
    if (fileUrl) {
      const suratRequest: ISurat = {
        nomor_surat: nomorSurat,
        tanggal_surat: tanggalSurat,
        perihal: perihal,
        penerima: penerima,
        tebusan: tebusan,
        nama_pengirim: namaPengirim,
        nim_pengirim: nimPengirim,
        prodi_pengirim: prodiPengirim,
        fakultas_pengirim: fakultasPengirim,
        kontak_pengirim: kontakPengirim,
        ormawa_pengirim: ormawaPengirim ?? null,
        file: fileUrl,
      };

      createSurat(suratRequest);

      route.push("/");
    }
  }, [fileUrl]);

  const [jurusanView, setJurusanView] = useState<
    { fakultas: string; nama: string }[]
  >([]);

  useEffect(() => {
    setJurusanView(jurusan.filter((j) => j.fakultas == fakultasPengirim));
  }, [fakultasPengirim]);

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
              <option value="KBAK">Kepala BAK</option>
              <option value="MK">Manager Kemahasiswaan</option>
              <option value="SM">Supervisor Minarpresma </option>
              <option value="SB">Supervisor Bikalima</option>
              <option value="SK">Supervisor Kesmala</option>
            </Select>

            <div>
              <div className="block tracking-wide text-gray-700 text-sm font-bold mb-2">
                Tebusan
              </div>
              <div
                className={
                  errorTebusan
                    ? "mt-2 bg-gray-200 py-2 px-4 text-gray-700 border-red-700  border rounded-md"
                    : "mt-2 bg-gray-200 py-2 px-4 text-gray-700 rounded-md"
                }
              >
                <div>
                  <input
                    type="checkbox"
                    id="penerima1"
                    name="penerima1"
                    value="KBAK"
                    onChange={(e) => {
                      setTebusan({
                        ...tebusan,
                        [e.target.value]: {
                          status: e.target.checked,
                          view: false,
                        },
                      });
                    }}
                  />
                  <label htmlFor="penerima1"> Kepala BAK</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="penerima2"
                    name="penerima2"
                    value="MK"
                    onChange={(e) => {
                      setTebusan({
                        ...tebusan,
                        [e.target.value]: {
                          status: e.target.checked,
                          view: false,
                        },
                      });
                    }}
                  />
                  <label htmlFor="penerima2"> Manager Kemahasiswaan</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="penerima3"
                    name="penerima3"
                    value="SM"
                    onChange={(e) => {
                      setTebusan({
                        ...tebusan,
                        [e.target.value]: {
                          status: e.target.checked,
                          view: false,
                        },
                      });
                    }}
                  />
                  <label htmlFor="penerima3"> Supervisor Minarpresma</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="penerima4"
                    name="penerima4"
                    value="SB"
                    onChange={(e) => {
                      setTebusan({
                        ...tebusan,
                        [e.target.value]: {
                          status: e.target.checked,
                          view: false,
                        },
                      });
                    }}
                  />
                  <label htmlFor="penerima4"> Supervisor Bikalima</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="penerima5"
                    name="penerima5"
                    value="SK"
                    onChange={(e) => {
                      setTebusan({
                        ...tebusan,
                        [e.target.value]: {
                          status: e.target.checked,
                          view: false,
                        },
                      });
                    }}
                  />
                  <label htmlFor="penerima5"> Supervisor Kesmala</label>
                </div>
              </div>
              <p className="text-red-500 text-xs mt-1">{errorTebusan}</p>
            </div>

            <div className=" grid grid-cols-2 gap-3">
              <Input
                required
                label={"Nama Pengirim"}
                error={errorNamaPengirim}
                onChange={(e) => setNamaPengirim(e.target.value)}
                id={"nama-pengirim"}
                value={namaPengirim}
              />
              <Input
                required
                label={"NIM Pengirim"}
                error={errorNIMPengirim}
                onChange={(e) => setNIMPengirim(e.target.value)}
                id={"nim-pengirim"}
                value={nimPengirim}
              />
            </div>
            <div className=" grid grid-cols-2 gap-3">
              <Select
                required
                label={"Fakultas"}
                error={errorFakultasPengirim}
                id={"fakultas"}
                onChange={(e) => setFakultasPengirim(e.target.value)}
              >
                <option value="">Pilih Fakultas</option>
                {fakultas.map((fakultas) => (
                  <option key={fakultas.nama} value={fakultas.nama}>
                    {fakultas.nama}
                  </option>
                ))}
              </Select>

              <Select
                required
                label={"Prodi"}
                error={errorProdiPengirim}
                id={"Prodi"}
                onChange={(e) => setProdiPengirim(e.target.value)}
              >
                <option value="">Pilih Prodi</option>

                {jurusanView.map((jurusan, index) => (
                  <option key={index} value={jurusan.nama}>
                    {jurusan.nama}
                  </option>
                ))}
              </Select>
            </div>
            <div className=" grid grid-cols-2 gap-3">
              <Input
                required
                type="tel"
                label={"Nomor WA Pengirim"}
                error={errorKontakPengirim}
                onChange={(e) => setKontakPengirim(e.target.value)}
                id={"kontak-pengirim"}
                value={kontakPengirim}
              />
              <Input
                label={"Ormawa Pengirim (jika ada)"}
                error={errorOrmawaPengirim}
                onChange={(e) => setOrmawaPengirim(e.target.value)}
                id={"ormawa-pengirim"}
                value={ormawaPengirim}
                disabled={ormawa}
              />
            </div>
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
    </>
  );
};

export default CreateSuratPage;
