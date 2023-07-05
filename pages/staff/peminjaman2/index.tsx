import type { NextPage } from "next";
import Head from "next/head";
import PageTitle from "../../../components/layout/PageTitle";
import { useState, useEffect } from "react";
import {
  IPeminjaman2,
  subscribeToPeminjaman,
} from "../../../firebase/peminjaman2";

const ManajemenPeminjamanPage: NextPage = () => {
  const [peminjaman, setPeminjaman] = useState<IPeminjaman2[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPeminjaman((updatedPeminjaman) => {
      setPeminjaman(updatedPeminjaman);
    });

    // Cleanup function to unsubscribe from the listener when component unmounts
    return () => unsubscribe();
  }, []);

  console.log(peminjaman[0].waktu_mulai.toDate());

  return (
    <>
      <Head>
        <title>Data Peminjaman Tempat</title>
      </Head>

      <PageTitle>Data Peminjaman Tempat</PageTitle>
    </>
  );
};

export default ManajemenPeminjamanPage;
