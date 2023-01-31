// Next
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

// Components
import PageTitle from "../../components/layout/PageTitle";
import Table from "react-tailwind-table";
import { tableStyling } from "../../components/table/tableStyling";
import { useEffect, useState } from "react";
import {
  getAllPeminjaman,
  deletePeminjaman,
  IPeminjamanData,
} from "../../firebase/peminjaman";
import { Irender_row } from "../../interface/table";
import PageBody from "../../components/layout/PageBody";
import { Dialog } from "@material-tailwind/react";

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
    field: "peminjaman.file",
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
  // State
  const [data, setData] = useState<IPeminjamanData[]>([]);
  const [file, setFile] = useState<string>("");
  const [selected, setSelected] = useState<IPeminjamanData | null>(null);

  // Get Data
  useEffect(() => {
    if (data.length === 0) {
      (async () => {
        const data: IPeminjamanData[] = await getAllPeminjaman();
        setData(data);
      })();
    }
  }, [data.length]);

  // Handler
  const handleDelete = async (id: string) => {
    await deletePeminjaman(id);
    setData([]);
  };

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

    if (column.field === "peminjaman.file") {
      return (
        <div className="flex items-center gap-1">
          {/* File Button */}
          <button
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
            onClick={() => setFile(row.peminjaman.file)}
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
            onClick={() => {}}
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
            onClick={() => handleDelete(row.id)}
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
        open={Boolean(file)}
        handler={() => setFile("")}
        className="overflow-scroll h-5/6 min-w-min"
      >
        <PDFViewer file={file} />
      </Dialog>
    </>
  );
};

export default ManajemenPeminjaman;
