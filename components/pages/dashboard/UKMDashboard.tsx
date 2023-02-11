import Head from "next/head";
import { useEffect, useState } from "react";
import { IPeminjamanData } from "../../../firebase/peminjaman";

export default function UKMDashboard(props: any) {
  const [peminjamanData, setPeminjamanData] = useState<IPeminjamanData[]>([]);

  return (
    <>
      <Head>
        <title>Dashboard UKM</title>
      </Head>
      <p>UKM</p>
    </>
  );
}
