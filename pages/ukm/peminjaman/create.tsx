import type { NextPage } from "next";
import Head from "next/head";
import PageTitle from "../../../components/layout/PageTitle";
import CreatePeminjaman from "../../../components/pages/ukm/WritePeminjaman";
import { useAuth } from "../../../lib/authContext";

const CreatePeminjamanPage: NextPage = () => {
  const { user, loading } = useAuth();
  return (
    <>
      <Head>
        <title>Pengajuan Permohonan Peminjaman</title>
      </Head>

      <PageTitle>Pengajuan Permohonan Peminjaman</PageTitle>
      <CreatePeminjaman type="new" />
    </>
  );
};

export default CreatePeminjamanPage;
