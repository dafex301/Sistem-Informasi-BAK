import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { authDataServer, authServer } from "../lib/session";
import type { TIdFirebase, UserData } from "../lib/authContext";
import React, { ReactNode } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await authServer(ctx);
  const userData = await authDataServer(ctx);

  return { props: { user, userData } };
};

const Home: NextPage = ({
  user,
  userData,
}: {
  user?: TIdFirebase;
  userData?: UserData;
  children?: ReactNode;
}) => {
  if (!user) return <h1>U need to login</h1>;

  return (
    <>
      <Head>
        <title>Private SSR</title>
      </Head>

      <main>
        <h1>Name : {userData?.name}</h1>
        <h1>Email : {user.email}</h1>
        Private with SSR
      </main>
    </>
  );
};

export default Home;
