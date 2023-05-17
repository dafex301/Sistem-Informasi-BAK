import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { ManajemenSurat } from "../../../components/pages/data/Surat";
import {
  getDisposisiSurat,
  getFinishedDisposisiSurat,
  ISuratData,
} from "../../../firebase/surat";
import { useAuth } from "../../../lib/authContext";

const SuratTembusan: NextPage = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState<ISuratData[]>([]);

  useEffect(() => {
    (async () => {
      const data: ISuratData[] = await getDisposisiSurat(user?.claims.role);
      const finishedData: ISuratData[] = await getFinishedDisposisiSurat(
        user?.claims.role
      );
      data.push(...finishedData);

      setData(data);
    })();
  }, [user?.claims.role]);

  return (
    <>
      <Head>
        <title>Surat Masuk</title>
      </Head>
      <PageTitle title="Surat Masuk" />
      <ManajemenSurat
        data={data}
        role={user?.claims.role}
        type="disposisi"
        setData={setData}
      />
    </>
  );
};

export default SuratTembusan;
