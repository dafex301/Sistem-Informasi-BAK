import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { ManajemenSurat } from "../../../components/pages/data/Surat";
import { getDisposisiSurat, ISuratData } from "../../../firebase/surat";
import { useAuth } from "../../../lib/authContext";

const SuratTebusan: NextPage = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState<ISuratData[]>([]);

  useEffect(() => {
    (async () => {
      const data: ISuratData[] = await getDisposisiSurat(user?.claims.role);
      setData(data);
    })();
  }, [user?.claims.role]);

  return (
    <>
      <Head>
        <title>Disposisi Surat</title>
      </Head>
      <PageTitle title="Disposisi Surat" />
      <ManajemenSurat data={data} role={user?.claims.role} type="disposisi" />
    </>
  );
};

export default SuratTebusan;
