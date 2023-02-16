import type { NextPage } from "next";
import Head from "next/head";
import PageTitle from "../../../components/layout/PageTitle";
import ManajemenPeminjaman from "../../../components/pages/data/Peminjaman";

const ManajemenPeminjamanPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Data Permohonan Peminjaman</title>
      </Head>

      <PageTitle>Data Permohonan Peminjaman</PageTitle>
      <ManajemenPeminjaman />
    </>
  );
};

export default ManajemenPeminjamanPage;
