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
  getAllPeminjamanData,
  IPeminjamanData,
} from "../../firebase/peminjaman";
import { Irender_row } from "../../interface/table";
import PageBody from "../../components/layout/PageBody";
import { Dialog, DialogBody } from "@material-tailwind/react";

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
    use: "File",
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

  // Get Data
  useEffect(() => {
    if (data.length === 0) {
      (async () => {
        const data: IPeminjamanData[] = await getAllPeminjamanData();
        setData(data);
      })();
    }
  }, [data.length]);

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
        <div className="flex items-center gap-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md"
            onClick={() => setFile(row.peminjaman.file)}
          >
            Lihat
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

      <Dialog open={Boolean(file)} handler={() => setFile("")}>
        <PDFViewer file={file} />
      </Dialog>
    </>
  );
};

export default ManajemenPeminjaman;
