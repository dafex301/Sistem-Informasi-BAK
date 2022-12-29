import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import "react-tailwind-table/dist/index.css";

import Table from "react-tailwind-table";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig/init";

const Home: NextPage = () => {
  const [data, setData] = useState([]);
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

  const usersRef = collection(db, "users");
  console.log(usersRef);
  // const querySnapshot = await getDocs(usersRef);
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  //   // setData((prev) => [...prev, doc.data()]);
  // });

  return (
    <>
      <Head>
        <title>Account Management</title>
      </Head>

      <main>Account management</main>
      <Table
        // per_page={3}
        styling={tableStyling}
        columns={[
          {
            field: "front_end_position.name",
            use: "Position",
          },
          {
            // use_in_display: false,
            field: "name", //Object destructure
            use: "Name",
          },

          {
            field: "shirt_number",
            use: "Actionz",
            // use_in_search:false
          },
        ]}
        rows={[
          {
            id: 1,
            name: "Sadio Mane",
            country_id: 3,
            club_id: 2,
            position_id: 1,
            shirt_number: "10",
            created_by: 2,
            deleted_at: null,
            created_at: "12/12/12 15:00:00",
            updated_at: "12/12/12 15:00:00",
            is_defender: false,
            is_midfielder: false,
            is_forward: true,
            is_goalkeeper: false,
            front_end_position: {
              name: "attach",
              id: 2,
            },
          },
          {
            id: 2,
            name: "Mohammed Sala",
            country_id: 3,
            club_id: 2,
            position_id: 1,
            shirt_number: "11",
            created_by: 2,
            deleted_at: null,
            created_at: "12/12/12 15:00:00",
            updated_at: "12/12/12 15:00:00",
            is_defender: false,
            is_midfielder: false,
            is_forward: true,
            is_goalkeeper: false,
            front_end_position: {
              name: "Forward",
              id: 4,
            },
          },
          {
            id: 3,
            name: "Robertor Fermino",
            country_id: 3,
            club_id: 2,
            position_id: 1,
            shirt_number: "8",
            created_by: 2,
            deleted_at: null,
            created_at: "12/12/12 15:00:00",
            updated_at: "12/12/12 15:00:00",
            is_defender: false,
            is_midfielder: false,
            is_forward: true,
            is_goalkeeper: false,
            front_end_position: {
              name: "Defence",
              id: 9,
            },
          },
          {
            id: 3,
            name: "Robertor Fermino",
            country_id: 3,
            club_id: 2,
            position_id: 1,
            shirt_number: "8",
            created_by: 2,
            deleted_at: null,
            created_at: "12/12/12 15:00:00",
            updated_at: "12/12/12 15:00:00",
            is_defender: false,
            is_midfielder: false,
            is_forward: true,
            is_goalkeeper: false,
            front_end_position: {
              name: "Defence",
              id: 9,
            },
          },
          {
            id: 3,
            name: "Robertor Fermino",
            country_id: 3,
            club_id: 2,
            position_id: 1,
            shirt_number: "8",
            created_by: 2,
            deleted_at: null,
            created_at: "12/12/12 15:00:00",
            updated_at: "12/12/12 15:00:00",
            is_defender: false,
            is_midfielder: false,
            is_forward: true,
            is_goalkeeper: false,
            front_end_position: {
              name: "Defence",
              id: 9,
            },
          },
        ]}
      ></Table>
    </>
  );
};

export default Home;
