import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAuth } from "../lib/authContext";

const Home: NextPage = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>Sweet home</main>
    </>
  );
};

export default Home;
