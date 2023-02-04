// Next
import type { NextPage } from "next";
import Head from "next/head";

// Component
import PageTitle from "../../../components/layout/PageTitle";
import ManajemenPeminjaman from "../../../components/pages/data/Peminjaman";
import { useAuth } from "../../../lib/authContext";

const ManajemenPeminjamanPage: NextPage = () => {
  const { user, loading } = useAuth();
  return (
    <>
      <Head>
        <title>Verifikasi Permohonan Peminjaman</title>
      </Head>

      <PageTitle>Verifikasi Permohonan Peminjaman</PageTitle>
      <ManajemenPeminjaman type="verify" role={user?.claims.role} />
    </>
  );
};

export default ManajemenPeminjamanPage;
