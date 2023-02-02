// Next
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";

// Components
import PageTitle from "../../components/layout/PageTitle";
import Table from "react-tailwind-table";
import { Irow } from "react-tailwind-table";
import { tableStyling } from "../../components/table/tableStyling";
import { useEffect, useState } from "react";
import { Irender_row } from "../../interface/table";
import PageBody from "../../components/layout/PageBody";
import { Dialog } from "@material-tailwind/react";
import Input from "../../components/forms/Input";
import { ToastContainer, toast } from "react-toastify";

// Data
import {
  getAllPeminjaman,
  deletePeminjaman,
  IPeminjamanData,
  updatePeminjaman,
} from "../../firebase/peminjaman";
import Select from "../../components/forms/Select";

const PDFViewer = dynamic(() => import("../../components/PDFViewer"), {
  ssr: false,
});

// Columns
const columns = [
  {
    field: "peminjaman.kegiatan",
    use: "Nama Kegiatan",
  },
  {
    // use_in_display: false,
    field: "peminjaman.pemohon.name",
    use: "Pemohon",
  },
  {
    field: "peminjaman.jenis_pinjaman",
    use: "Jenis Pinjaman",
  },
  {
    field: "peminjaman.waktu_pinjam",
    use: "Waktu Pinjam",
  },
  {
    field: "peminjaman.waktu_kembali",
    use: "Waktu Kembali",
  },

  {
    field: "status",
    use: "Status",
    // use_in_search:false
  },
  {
    field: "aksi",
    use: "Aksi",
    use_in_search: false,
  },
  // {
  //   field: "actions",
  //   use: "Actions",
  //   // use_in_search:false
  // },
];

const ManajemenPeminjaman: NextPage = () => {
  // Data State
  const [data, setData] = useState<IPeminjamanData[]>([]);
  const [selected, setSelected] = useState<
    [string, Irow | IPeminjamanData | undefined]
  >(["", undefined]);

  // Input State
  const [kegiatan, setKegiatan] = useState("");
  const [errorKegiatan, setErrorKegiatan] = useState("");

  const [jenisPinjaman, setJenisPinjaman] = useState("");
  const [errorJenisPinjaman, setErrorJenisPinjaman] = useState("");

  const [waktuPinjam, setWaktuPinjam] = useState("");
  const [errorWaktuPinjam, setErrorWaktuPinjam] = useState("");

  const [waktuKembali, setWaktuKembali] = useState("");
  const [errorWaktuKembali, setErrorWaktuKembali] = useState("");

  // Get Data
  useEffect(() => {
    if (data.length === 0) {
      (async () => {
        const data: IPeminjamanData[] = await getAllPeminjaman();
        setData(data);
      })();
    }
  }, [data.length]);

  // Update state value when selected change
  useEffect(() => {
    if (selected[1]) {
      setKegiatan(selected[1].peminjaman.kegiatan);
      setJenisPinjaman(selected[1].peminjaman.jenis_pinjaman);
      setWaktuPinjam(
        selected[1].peminjaman.waktu_pinjam.toDate().toISOString().slice(0, 16)
      );
      setWaktuKembali(
        selected[1].peminjaman.waktu_kembali.toDate().toISOString().slice(0, 16)
      );
    }
  }, [selected]);

  // Handler
  const handleDelete = async () => {
    await deletePeminjaman(selected[1]?.id).then(() => {
      setData([]);
      setSelected(["", undefined]);
      toast.success("Delete success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  };

  const handleUpdate = async () => {
    if (kegiatan === "") {
      setErrorKegiatan("Nama kegiatan tidak boleh kosong");
    } else {
      setErrorKegiatan("");
    }

    if (jenisPinjaman === "") {
      setErrorJenisPinjaman("Jenis pinjaman tidak boleh kosong");
    } else {
      setErrorJenisPinjaman("");
    }

    if (waktuPinjam && waktuKembali) {
      if (waktuPinjam > waktuKembali) {
        setErrorWaktuKembali(
          "Waktu kembali tidak boleh kurang dari waktu pinjam"
        );
        setErrorWaktuKembali(
          "Waktu kembali tidak boleh kurang dari waktu pinjam"
        );
        return;
      } else {
        setErrorWaktuPinjam("");
        setErrorWaktuKembali("");
      }
    } else {
      setErrorWaktuKembali("Waktu kembali tidak boleh kosong");
      setErrorWaktuPinjam("Waktu pinjam tidak boleh kosong");
    }

    if (kegiatan && jenisPinjaman && waktuPinjam && waktuKembali) {
      console.log("updating");
      await updatePeminjaman(
        selected[1]?.id,
        kegiatan,
        jenisPinjaman,
        new Date(waktuPinjam),
        new Date(waktuKembali)
      ).then(() => {
        setData([]);
        setSelected(["", undefined]);

        toast.success("Update success", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    }
  };

  // Table
  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "peminjaman.kegiatan") {
      return (
        <div className="flex items-center gap-2">
          <p className="font-semibold">{display_value}</p>
        </div>
      );
    }

    if (column.field === "peminjaman.waktu_pinjam") {
      return <p>{display_value.toDate().toLocaleString("id-ID")}</p>;
    }

    if (column.field === "peminjaman.waktu_kembali") {
      return <p>{display_value.toDate().toLocaleString("id-ID")}</p>;
    }

    if (column.field === "status") {
      if (row.peminjaman.rejected) {
        return <p>Ditolak</p>;
      }
      if (row.peminjaman.paraf_SM) {
        return <p>Selesai</p>;
      }
      if (row.peminjaman.paraf_MK) {
        return <p>Diproses SM</p>;
      }
      if (row.peminjaman.paraf_KBK) {
        return <p>Diproses MK</p>;
      }
      if (!row.peminjaman.paraf_KBK) {
        return <p>Diproses KBK</p>;
      }
    }

    if (column.field === "aksi") {
      return (
        <div className="flex items-center gap-1">
          {/* File Button */}
          <button
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
            onClick={() => setSelected(["file", row])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
            </svg>
          </button>

          {/* Edit Button */}

          <button
            className="bg-cyan-500 text-white p-2 rounded-md hover:bg-cyan-700"
            onClick={() => setSelected(["update", row])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
            onClick={() => setSelected(["delete", row])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      );
    }

    return display_value;
  };

  return (
    <>
      <Head>
        <title>Manajemen Peminjaman</title>
      </Head>

      <PageTitle>Manajemen Peminjaman</PageTitle>
      <PageBody>
        <Table
          // per_page={3}
          row_render={rowcheck}
          styling={tableStyling}
          columns={columns}
          rows={data}
        />
      </PageBody>

      <Dialog
        open={Boolean(selected[0])}
        handler={() => setSelected(["", undefined])}
        className="overflow-auto min-w-min w-auto"
      >
        {selected[0] === "file" && (
          <div className="h-[36rem]">
            <PDFViewer file={selected[1]?.peminjaman.file} />
          </div>
        )}

        {selected[0] === "delete" && (
          <div className="w-96 flex flex-col gap-4 justify-center items-center text-center px-5 py-10">
            <Image
              src={"/assets/delete-document.png"}
              width={512}
              height={512}
              alt={"Document"}
              className="w-24 h-24"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Apakah anda yakin untuk menghapus permohonan peminjaman ini?
            </h2>
            <p className="text-gray-800">{selected[1]?.peminjaman.kegiatan}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(["", undefined])}
                className="border border-gray-400 px-8 py-1 rounded-md text-gray-800 focus:outline-none hover:bg-gray-50 shadow-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="border border-red-400 px-8 py-1 rounded-md text-white focus:outline-none bg-red-600 hover:bg-red-700 shadow-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {selected[0] === "update" && (
          <div className="flex flex-col p-5 h-auto w-[36rem] gap-5">
            <div className="">
              <h2 className="font-semibold text-lg text-gray-900">
                Update Permohonan Peminjaman
              </h2>
            </div>
            <form className="flex flex-col gap-4">
              <Input
                label="Nama Kegiatan"
                error={errorKegiatan}
                onChange={(e) => setKegiatan(e.target.value)}
                id={"nama-kegiatan"}
                value={kegiatan}
                style="light"
                required
              />
              <Select
                label={"Jenis Pinjaman"}
                required
                value={jenisPinjaman}
                onChange={(e) => setJenisPinjaman(e.target.value)}
                error={errorJenisPinjaman}
                id={"jenis-pinjaman"}
                style="light"
              >
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
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Waktu Pinjam"
                  type="datetime-local"
                  error={errorWaktuPinjam}
                  onChange={(e) => setWaktuPinjam(e.target.value)}
                  id={"waktu-pinjam"}
                  value={waktuPinjam}
                  style="light"
                  required
                />
                <Input
                  label="Waktu Kembali"
                  type="datetime-local"
                  error={errorWaktuKembali}
                  onChange={(e) => setWaktuKembali(e.target.value)}
                  id={"waktu-kembali"}
                  value={waktuKembali}
                  style="light"
                  required
                />
              </div>
            </form>

            <div className="w-full grid grid-cols-2 gap-3 font-medium">
              <button
                onClick={() => setSelected(["", undefined])}
                className="border border-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                className="bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ManajemenPeminjaman;
