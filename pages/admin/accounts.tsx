// Next
import type { NextPage } from "next";
import Head from "next/head";
import "react-tailwind-table/dist/index.css";
import Accounts from "../../components/pages/admin/Accounts";

const Mahasiswa: NextPage = () => {
  return (
    <>
      <Head>
        <title>Akun Mahasiswa</title>
      </Head>
      <Accounts />
    </>
  );
};

export default Mahasiswa;
