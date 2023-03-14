import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { ManajemenSurat } from "../../../components/pages/data/Surat";
import { getTebusanSurat, ISuratData } from "../../../firebase/surat";
import { useAuth } from "../../../lib/authContext";

const SuratTebusan: NextPage = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState<ISuratData[]>([]);

  const role = user?.claims.role;

  const roleWithoutStaf = role?.replace("staf_", "");

  useEffect(() => {
    (async () => {
      const data: ISuratData[] = await getTebusanSurat(roleWithoutStaf);
      setData(data);
    })();
  }, [roleWithoutStaf]);

  return (
    <>
      <Head>
        <title>Surat Tebusan</title>
      </Head>
      <PageTitle title="Surat Tebusan" />
      <ManajemenSurat data={data} role={user?.claims.role} type="tebusan" />
    </>
  );
};

export default SuratTebusan;
