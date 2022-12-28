import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useAuth } from "../lib/authContext";

const Profile: NextPage = () => {
  const { user, userData, loading } = useAuth();

  console.log(user);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <main>
        <h1>Profile</h1>
        <h1>Name : {userData?.name}</h1>
        <h1>Email : {user?.claims.email}</h1>
        Private
      </main>
    </>
  );
};

export default Profile;
