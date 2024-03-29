import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import PageTitle from "../../../components/layout/PageTitle";
import ManajemenPeminjaman from "../../../components/pages/data/Peminjaman";
import { useAuth } from "../../../lib/authContext";

const ManajemenPeminjamanPage: NextPage = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Data Peminjaman Tempat</title>
      </Head>

      <PageTitle>Data Peminjaman Tempat</PageTitle>
      <ManajemenPeminjaman role={user?.claims.role} />
    </>
  );
};

export default ManajemenPeminjamanPage;
