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
import { Button, Dropdown, Modal } from "flowbite-react";
import {
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { Irender_row } from "../../interface/table";
import { tableStyling } from "../../components/table/tableStyling";
import { useAuth } from "../../lib/authContext";
import { userAccount } from "../../interface/userAccount";

const Home: NextPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DocumentData[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [deleteUser, setDeleteUser] = useState<userAccount | null>(null);

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
            onClick={() => handleDeleteButton(row)}
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

  const handleDeleteButton = (user: any) => {
    setDeleteUser(user);
    setModal(true);
  };

  const handleDelete = () => {
    if (user && deleteUser) {
      const { email } = deleteUser;
      // Request to /api/auth/delete with email as body
      fetch(`/api/auth/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization token
          Authorization: user.token,
        },
        body: JSON.stringify({ email: email }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        });

      let tempData = data.filter((row) => row.email !== email);
      setData(tempData);
      setModal(false);
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

      <Modal
        show={modal}
        size="md"
        popup={true}
        onClose={() => setModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <p className="text-md font-normal text-gray-500 dark:text-gray-400">
              {deleteUser?.no_induk} - {deleteUser?.name}
            </p>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Apakah anda yakin menghapus akun ini?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Ya, saya yakin
              </Button>
              <Button color="gray" onClick={() => setModal(false)}>
                Tidak, batal
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Home;
