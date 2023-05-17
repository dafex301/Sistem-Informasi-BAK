import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { ManajemenSurat } from "../../../components/pages/data/Surat";
import { getTembusanSurat, ISuratData } from "../../../firebase/surat";
import { useAuth } from "../../../lib/authContext";

const SuratTembusan: NextPage = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState<ISuratData[]>([]);

  const role = user?.claims.role;

  const roleWithoutStaf = role?.replace("staf_", "");

  useEffect(() => {
    (async () => {
      const data: ISuratData[] = await getTembusanSurat(roleWithoutStaf);
      setData(data);
    })();
  }, [roleWithoutStaf]);

  return (
    <>
      <Head>
        <title>Surat Tembusan</title>
      </Head>
      <PageTitle title="Surat Tembusan" />
      <ManajemenSurat data={data} role={user?.claims.role} type="tembusan" />
    </>
  );
};

export default SuratTembusan;
