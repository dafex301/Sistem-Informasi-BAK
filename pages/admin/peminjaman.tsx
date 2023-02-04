import type { NextPage } from "next";
import Head from "next/head";
import PageTitle from "../../components/layout/PageTitle";
import ManajemenPeminjaman from "../../components/pages/data/Peminjaman";

const ManajemenPeminjamanPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Manajemen Peminjaman</title>
      </Head>

      <PageTitle>Manajemen Peminjaman</PageTitle>
      <ManajemenPeminjaman role="admin" />
    </>
  );
};

export default ManajemenPeminjamanPage;
