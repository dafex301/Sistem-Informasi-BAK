import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import { ManajemenSurat } from "../../components/pages/data/Surat";
import { getAllSurat, ISuratData } from "../../firebase/surat";
import { useAuth } from "../../lib/authContext";

const ManajemenSuratAdmin: NextPage = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState<ISuratData[]>([]);

  useEffect(() => {
    (async () => {
      const data: ISuratData[] = await getAllSurat();
      setData(data);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Manajemen Surat</title>
      </Head>
      <PageTitle title="Manajemen Surat" />
      <ManajemenSurat data={data} role={user?.claims.role} type="data" />
    </>
  );
};

export default ManajemenSuratAdmin;
