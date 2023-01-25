import { Input } from "@material-tailwind/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import PageTitle from "../components/layout/PageTitle";
import { useAuth } from "../lib/authContext";

const Proposal: NextPage = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Pengajuan Proposal & Dana</title>
      </Head>
      <PageTitle title="Pengajuan Proposal dan Dana" />
      <main>
        <Input label="" />
      </main>
    </>
  );
};

export default Proposal;
