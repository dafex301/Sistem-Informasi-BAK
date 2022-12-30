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

// Components
import Table from "react-tailwind-table";
import { Button, Dropdown } from "flowbite-react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Irender_row } from "../../interface/table";
import { tableStyling } from "../../components/table/tableStyling";
import { useAuth } from "../../lib/authContext";

const Home: NextPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DocumentData[]>([]);

  // Firebase Query
  const q = query(collection(db, "users"), orderBy("created_at", "desc"));

  // Table setting
  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "role") {
      return (
        <>
          <Dropdown className="" inline color="light" label={row.role}>
            {["Mahasiswa", "Staff", "Admin"].map((role) => {
              if (role !== row.role) {
                return (
                  <Dropdown.Item
                    className=""
                    key={role}
                    onClick={() => handleRoleChange(row.email, role)}
                  >
                    {role}
                  </Dropdown.Item>
                );
              }
            })}
          </Dropdown>
        </>
      );
    }

    if (column.field === "name") {
      return <p className="font-semibold">{display_value}</p>;
    }

    if (column.field === "actions") {
      return (
        <div className="flex gap-1">
          <Button className="p-0">
            <PencilIcon className="h-4 w-4 text-white" />
          </Button>
          <Button
            className="p-0"
            color={"failure"}
            onClick={() => handleDelete(row.email)}
          >
            <TrashIcon className="h-4 w-4 text-white" />
          </Button>
        </div>
      );
    }

    return display_value;
  };

  const handleRoleChange = (email: string, role: string) => {
    // Request to /api/auth/roles/${role} with email as body
    fetch(`/api/auth/roles/${role}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });

    let tempData = data.map((row) => {
      if (row.email === email) {
        row.role = role;
      }
      return row;
    });
    setData(tempData);
  };

  const handleDelete = (email: string) => {
    if (user) {
      // Request to /api/auth/delete with email as body
      fetch(`/api/auth/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization token
          Authorization: user.token,
        },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          let tempData = data.filter((row) => row.email !== email);
          setData(tempData);
        });
    }
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

      <div className="rounded-3xl drop-shadow-lg">
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
              field: "actions",
              use: "Actions",
              // use_in_search:false
            },
          ]}
          rows={data}
        ></Table>
      </div>
    </>
  );
};

export default Home;
