import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import PageTitle from "../../../components/layout/PageTitle";
import { useAuth } from "../../../lib/authContext";

const UKMSurat: NextPage = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Manajemen Surat</title>
      </Head>
      <PageTitle title="Manajemen Surat" />
      <main></main>
    </>
  );
};

export default UKMSurat;
