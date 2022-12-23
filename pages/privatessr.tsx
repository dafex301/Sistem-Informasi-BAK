import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { authServer } from "../lib/session";
import type { TIdFirebase } from "../lib/authContext";
import React, { ReactNode } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await authServer(ctx);

  return { props: { user } };
};

const Home: NextPage = ({
  user,
}: {
  user?: TIdFirebase;
  children?: ReactNode;
}) => {
  if (!user) return <h1>U need to login</h1>;

  console.log(user)

  return (
    <>
      <Head>
        <title>Private SSR</title>
      </Head>

      <main>
        <h1>Email : {user.email}</h1>
        Private with SSR
      </main>
    </>
  );
};

export default Home;
