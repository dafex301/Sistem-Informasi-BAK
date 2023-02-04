import type { NextPage } from "next";
import Head from "next/head";
import PageTitle from "../../../components/layout/PageTitle";
import ManajemenPeminjaman from "../../../components/pages/data/Peminjaman";
import { useAuth } from "../../../lib/authContext";

const ManajemenPeminjamanPage: NextPage = () => {
  const { user, loading } = useAuth();
  return (
    <>
      <Head>
        <title>Data Permohonan Peminjaman</title>
      </Head>

      <PageTitle>Data Permohonan Peminjaman</PageTitle>
      <ManajemenPeminjaman role={user?.claims.role} />
    </>
  );
};

export default ManajemenPeminjamanPage;
