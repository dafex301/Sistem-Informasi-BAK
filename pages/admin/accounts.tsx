// Next
import type { NextPage } from "next";
import Head from "next/head";
import "react-tailwind-table/dist/index.css";
import Accounts from "../../components/pages/admin/Accounts";

const ManajemenAkun: NextPage = () => {
  return (
    <>
      <Head>
        <title>Manajemen Akun</title>
      </Head>
      <Accounts />
    </>
  );
};

export default ManajemenAkun;
