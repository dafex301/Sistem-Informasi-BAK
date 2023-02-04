import { DocumentData } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageTitle from "../../../../components/layout/PageTitle";
import Loading from "../../../../components/Loading";
import CreatePeminjaman from "../../../../components/pages/ukm/WritePeminjaman";
import {
  IPeminjamanData,
  getAllPeminjaman,
  getPeminjamanById,
} from "../../../../firebase/peminjaman";
import { useAuth } from "../../../../lib/authContext";

const RevisiPeminjamanPage: NextPage = () => {
  const { user, loading } = useAuth();
  const [loadingData, setLoadingData] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<DocumentData | null>([]);

  useEffect(() => {
    if (data!.length === 0) {
      (async () => {
        const data = await getPeminjamanById(id as string);
        setData(data);
        setLoadingData(false);
      })();
    }
  });

  return (
    <>
      <Head>
        <title>Revisi Permohonan Peminjaman</title>
      </Head>

      {loadingData ? (
        // TODO: MAKE PROPER LOADING SCREEN
        <p>Loading...</p>
      ) : (
        <>
          <PageTitle>Revisi Permohonan Peminjaman</PageTitle>
          <CreatePeminjaman type="revision" data={data} id={id as string} />
        </>
      )}
    </>
  );
};

export default RevisiPeminjamanPage;
