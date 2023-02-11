import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageBody from "../components/layout/PageBody";
import PageTitle from "../components/layout/PageTitle";
import AdminDashboard from "../components/pages/dashboard/AdminDashboard";

import { useAuth } from "../lib/authContext";

const Home: NextPage = () => {
  const { user, loading } = useAuth();
  const role = user?.claims.role;

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageTitle>Dashboard</PageTitle>
      <PageBody>
        {role === "admin" ? (
          <AdminDashboard />
        ) : role === "UKM" ? (
          <p>UKM</p>
        ) : role === "KBAK" || role === "SM" || role === "MK" ? (
          <p>Staff</p>
        ) : (
          <p>Guest</p>
        )}
      </PageBody>
    </>
  );
};

export default Home;
