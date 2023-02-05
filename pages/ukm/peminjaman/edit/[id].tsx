import { DocumentData } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PageBody from "../../../../components/layout/PageBody";
import PageTitle from "../../../../components/layout/PageTitle";
import CreatePeminjaman from "../../../../components/pages/ukm/WritePeminjaman";
import { getPeminjamanById } from "../../../../firebase/peminjaman";
import { useAuth } from "../../../../lib/authContext";

const EditPeminjamanPage: NextPage = () => {
  const { user, loading } = useAuth();

  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<DocumentData | null>([]);

  useEffect(() => {
    if (data!.length === 0 && id) {
      (async () => {
        const data = await getPeminjamanById(id as string);
        setData(data!);
      })();
    }
  });

  return (
    <>
      <Head>
        <title>Edit Permohonan Peminjaman</title>
      </Head>

      <PageTitle>Edit Permohonan Peminjaman</PageTitle>
      <PageBody>
        <CreatePeminjaman type="update" data={data} id={id as string} />
      </PageBody>
    </>
  );
};

export default EditPeminjamanPage;
