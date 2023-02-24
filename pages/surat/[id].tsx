import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/router";
import PageBody from "../../components/layout/PageBody";
// import {
//   getLogPeminjamanById,
//   getPeminjamanById,
// } from "../../firebase/peminjaman";
import { DocumentData } from "firebase/firestore";
import { actionTranslation, roleAbbreviation } from "../../lib/functions";

const SuratDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();

  // State
  const [data, setData] = useState<DocumentData | null>(null);
  const [logData, setLogData] = useState<DocumentData | null>(null);

  // Get data

  return (
    <>
      <Head>
        <title>Surat Detail</title>
      </Head>
      <PageTitle>Surat Detail</PageTitle>
      <PageBody></PageBody>
    </>
  );
};

export default SuratDetail;
