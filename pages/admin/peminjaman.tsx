// Next
import type { NextPage } from "next";
import Head from "next/head";

// Components
import PageTitle from "../../components/layout/PageTitle";
import Table from "react-tailwind-table";
import { tableStyling } from "../../components/table/tableStyling";
import { useEffect, useState } from "react";
import {
  getAllPeminjamanData,
  IPeminjamanData,
} from "../../firebase/peminjaman";

// Columns
let columns = [
  {
    field: "kegiatan",
    use: "Nama Kegiatan",
  },
  {
    // use_in_display: false,
    field: "pemohon",
    use: "Pemohon",
  },
  {
    field: "waktu_pinjam",
    use: "Waktu Pinjam",
  },
  {
    field: "waktu_kembali",
    use: "Waktu Kembali",
  },

  {
    field: "paraf_SM",
    use: "Status",
    // use_in_search:false
  },
  {
    field: "actions",
    use: "Actions",
    // use_in_search:false
  },
];

const ManajemenPeminjaman: NextPage = () => {
  // State
  const [data, setData] = useState<IPeminjamanData[]>([]);

  // Fetch data from firestore permohonan_peminjaman
  // if (data.length === 0) {
  //   getAllPeminjamanData().then((data) => {
  //     console.log(data);
  //     setData(data);
  //   });
  // }

  // Fetch data from firestore permohonan_peminjaman
  // useEffect(() => {
  //   peminjamanData.then((data) => {
  //     setData(data);
  //   });
  // });

  return (
    <>
      <Head>
        <title>Manajemen Peminjaman</title>
      </Head>

      <PageTitle>Manajemen Peminjaman</PageTitle>
      <div className="mx-5">
        <Table
          // per_page={3}
          // row_render={rowcheck}
          styling={tableStyling}
          columns={columns}
          rows={data}
        />
      </div>
    </>
  );
};

export default ManajemenPeminjaman;
