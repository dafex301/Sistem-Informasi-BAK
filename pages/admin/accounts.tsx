// Next
import type { NextPage } from "next";
import Head from "next/head";
import Accounts from "../../components/pages/data/Accounts";

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
