import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useAuth } from "../lib/authContext";

const Home: NextPage = () => {
  const { user, userData, loading } = useAuth();

  console.log("private", userData);

  if (loading) return <h1>Loading...</h1>;
  if (!user) return <h1>U need to login</h1>;
  return (
    <>
      <Head>
        <title>Private</title>
      </Head>

      <main>
        <h1>Name : {userData?.name}</h1>
        <h1>Email : {user?.claims.email}</h1>
        Private
      </main>
    </>
  );
};

export default Home;
