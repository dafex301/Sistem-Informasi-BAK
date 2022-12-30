// Next
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import "react-tailwind-table/dist/index.css";

// Firebase
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig/init";
import { useAuth } from "../../lib/authContext";

// Components
import Table, { Icolumn, Irow } from "react-tailwind-table";

const Home: NextPage = () => {
  const { user, userData, loading } = useAuth();
  const [data, setData] = useState<DocumentData[]>([]);

  // Firebase Query
  const q = query(collection(db, "users"), orderBy("created_at", "desc"));

  const tableStyling = {
    // base_bg_color: "bg-green-600",
    // base_text_color: "text-green-600",
    top: {
      // title:"text-red-700"
      elements: {
        // main: "bg-green-700",
        // search: "text-white",
        bulk_select: {
          // main: "bg-green-700 text-white",
          // button:"bg-yellow-700 text-black px-5 "
        },
        // export:"text-yellow-800"
      },
    },
    table_head: {
      table_row: "",
      table_data: "text-white bg-gray-500",
    },
    table_body: {
      // main: "bg-red-600",
      // table_row: "text-yellow-900",
      // table_data: "text-base"
    },
    footer: {
      // main: "bg-yellow-700",
      statistics: {
        // main: "bg-white text-green-900",
        // bold_numbers:"text-yellow-800 font-thin"
      },
      // page_numbers: "bg-red-600 text-white",
    },
  };

  type Irender_row = (
    row: Irow,
    col: Icolumn,
    display_value: any
  ) => JSX.Element | string;

  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "actions") {
      return (
        <>
          <button className="border p-2">{display_value}</button>
        </>
      );
    }

    if (column.field === "name") {
      return <p className="font-semibold">{display_value}</p>;
    }

    return display_value;
  };

  useEffect(() => {
    if (data.length === 0) {
      let tempData: DocumentData[] = [];
      const querySnapshot = getDocs(q);
      querySnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempData.push(doc.data());
        });
        setData(tempData);
      });
    }
  });

  return (
    <>
      <Head>
        <title>Account Management</title>
      </Head>

      <main>Account management</main>
      <Table
        // per_page={3}
        row_render={rowcheck}
        styling={tableStyling}
        columns={[
          {
            field: "no_induk",
            use: "NIM/NIP",
          },
          {
            // use_in_display: false,
            field: "name", //Object destructure
            use: "Name",
          },

          {
            field: "role",
            use: "Role",
            // use_in_search:false
          },
          {
            field: "email",
            use: "Actions",
            // use_in_search:false
          },
        ]}
        rows={data}
      ></Table>
    </>
  );
};

export default Home;
