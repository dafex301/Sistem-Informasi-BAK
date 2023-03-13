import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { ManajemenSurat } from "../../../components/pages/data/Surat";
import { getAllSurat, ISuratData } from "../../../firebase/surat";
import { useAuth } from "../../../lib/authContext";

const SuratPribadi: NextPage = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState<ISuratData[]>([]);

  useEffect(() => {
    (async () => {
      const data: ISuratData[] = await getAllSurat(user?.claims.role);
      setData(data);
    })();
  }, [user?.claims.role]);

  return (
    <>
      <Head>
        <title>Inbox Surat</title>
      </Head>
      <PageTitle title="Inbox Surat" />
      <ManajemenSurat data={data} role={user?.claims.role} type="pribadi" />
    </>
  );
};

export default SuratPribadi;
