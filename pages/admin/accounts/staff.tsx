// Next
import type { NextPage } from "next";
import Head from "next/head";
import "react-tailwind-table/dist/index.css";
import Accounts from "../../../components/pages/admin/Accounts";

const Staff: NextPage = () => {
  return (
    <>
      <Head>
        <title>Akun Staff</title>
      </Head>
      <Accounts role="Staff" />
    </>
  );
};

export default Staff;
