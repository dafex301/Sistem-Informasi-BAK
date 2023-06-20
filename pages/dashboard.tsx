import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageBody from "../components/layout/PageBody";
import PageTitle from "../components/layout/PageTitle";
import AdminDashboard from "../components/pages/dashboard/AdminDashboard";
import GuestDashboard from "../components/pages/dashboard/GuestDashboard";
import StaffDashboard from "../components/pages/dashboard/StaffDashbord";
import ORMAWADashboard from "../components/pages/dashboard/ORMAWADashboard";
import SekretarisDashboard from "../components/pages/dashboard/SekretarisDashboard";

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
        ) : role === "ORMAWA" ? (
          <ORMAWADashboard user={user} />
        ) : role === "KBAK" || role === "SM" || role === "MK" ? (
          <StaffDashboard />
        ) : role === "SBAK" ? (
          <SekretarisDashboard />
        ) : (
          <GuestDashboard />
        )}
      </PageBody>
    </>
  );
};

export default Home;
