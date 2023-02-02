import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/router";
import PageBody from "../../components/layout/PageBody";

const PeminjamanDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Permohonan Peminjaman Detail</title>
      </Head>
      <PageTitle>Permohonan Peminjaman Detail</PageTitle>
      <PageBody>{id}</PageBody>
    </>
  );
};

export default PeminjamanDetail;
