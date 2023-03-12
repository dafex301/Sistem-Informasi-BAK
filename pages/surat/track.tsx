import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import { useAuth } from "../../lib/authContext";

const Track: NextPage = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Track Surat</title>
      </Head>
      <PageTitle title="Track Surat" />
      <main></main>
    </>
  );
};

export default Track;
