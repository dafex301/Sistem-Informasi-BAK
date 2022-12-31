// Next
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import "react-tailwind-table/dist/index.css";

// Firebase
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  Query,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig/init";

// Components
import Table from "react-tailwind-table";
import {
  Button,
  Select,
  Dropdown,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import {
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { Irender_row } from "../../../interface/table";
import { tableStyling } from "../../table/tableStyling";
import { useAuth } from "../../../lib/authContext";
import { userAccount } from "../../../interface/userAccount";
import { IFakultas } from "../../../interface/fakultas";
import { IJurusan } from "../../../interface/jurusan";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AccountsProps {
  role: string;
}

const Accounts: NextPage<AccountsProps> = ({ role }) => {
  // =============== State ===============
  const { user } = useAuth();
  const [data, setData] = useState<DocumentData[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<userAccount | null>(null);

  // =============== Update state ===============
  const [updatedName, setUpdatedName] = useState<string>("");
  const [updatedNoInduk, setUpdatedNoInduk] = useState<string>("");
  const [updatedFakultas, setUpdatedFakultas] = useState<string>("");
  const [updatedJurusan, setUpdatedJurusan] = useState<string>("");
  const [updatedPhone, setUpdatedPhone] = useState<string>("");
  const [updatedJabatan, setUpdatedJabatan] = useState<string>("");
  const [updatedStatus, setUpdatedStatus] = useState<string>("");

  const [jurusan, setJurusan] = useState<IJurusan[]>([]);

  // =============== Data =================
  const fakultasData = require("../../../data/fakultas.json");
  const jurusanData = require("../../../data/jurusan.json");

  // =============== Firebase Query ===============
  let q: Query<DocumentData>;
  if (role === "Mahasiswa") {
    q = query(
      collection(db, "users"),
      where("role", "==", "Mahasiswa"),
      orderBy("name", "asc")
    );
  } else {
    q = query(
      collection(db, "users"),
      where("role", "!=", "Mahasiswa"),
      orderBy("role", "asc"),
      orderBy("name", "asc")
    );
  }
  // =============== Table Row ===============
  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "status") {
      return (
        <>
          <Dropdown className="" inline color="light" label={row.status}>
            {["Aktif", "Nonaktif"].map((status) => {
              if (status !== row.status) {
                return (
                  <Dropdown.Item
                    className=""
                    key={status}
                    onClick={() => handleStatusChange(row.email, status)}
                    value={status}
                  >
                    {status}
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
          <Button className="p-0" onClick={() => handleUpdateButton(row)}>
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

  // =============== Handler ===============
  const handleStatusChange = (email: string, status: string) => {
    // Request to /api/auth/roles/${role} with email as body
    if (user) {
      fetch(`/api/auth/staff/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({ email, status }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        });

      let tempData = data.map((row) => {
        if (row.email === email) {
          row.status = status;
        }
        return row;
      });
      setData(tempData);
      toast.success("Status berhasil diubah");
    }
  };

  const handleDeleteButton = (user: any) => {
    setSelectedUser(user);
    setModal("delete");
  };

  const handleDelete = () => {
    if (user && selectedUser) {
      const { email } = selectedUser;
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
      setModal(null);
      handleToast("Delete");
    }
  };

  const handleUpdateButton = (user: any) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedNoInduk(user.no_induk);
    setUpdatedFakultas(user.fakultas ?? "");
    setUpdatedJurusan(user.jurusan ?? "");
    setUpdatedPhone(user.phone ?? "");
    setUpdatedJabatan(user.jabatan ?? "");

    setModal("update");
  };

  const handleUpdate = () => {
    if (user && selectedUser) {
      const { email } = selectedUser;
      // Request to /api/auth/update with email as body
      fetch(`/api/auth/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({
          email: email,
          name: updatedName,
          no_induk: updatedNoInduk,
          fakultas: updatedFakultas,
          jurusan: updatedJurusan,
          phone: updatedPhone,
          jabatan: updatedJabatan,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        });

      let tempData = data.map((row) => {
        if (row.email === email) {
          row.name = updatedName;
          row.no_induk = updatedNoInduk;
          row.fakultas = updatedFakultas;
          row.jurusan = updatedJurusan;
          row.phone = updatedPhone;
          row.jabatan = updatedJabatan;
        }
        return row;
      });
      setData(tempData);
      setModal(null);
      handleToast("Update");
    }
  };

  // ================== Toast ==================
  const handleToast = (status: string) => {
    toast.success(`${status} data berhasil`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // =============== UseEffect ===============
  useEffect(() => {
    if (data.length === 0) {
      let tempData: DocumentData[] = [];
      const querySnapshot = getDocs(q);
      querySnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempData.push(doc.data());
        });

        // Filter data to only show data that is not the current user
        if (user) {
          tempData = tempData.filter((row) => row.email !== user.claims.email);
        }

        setData(tempData);
      });
    }
  });

  // useEffect to get jurusan based on fakultas
  useEffect(() => {
    if (updatedFakultas) {
      const jurusan = jurusanData.filter(
        (jurusan: IJurusan) => jurusan.faculty === updatedFakultas
      );
      setJurusan(jurusan);
    }
  }, [jurusanData, updatedFakultas]);

  // Table Custom Styling based on Role
  let columnNoInduk: string;
  let columns;
  switch (role) {
    case "Mahasiswa":
      columnNoInduk = "NIM";
      columns = [
        {
          field: "no_induk",
          use: columnNoInduk,
        },
        {
          // use_in_display: false,
          field: "name", //Object destructure
          use: "Name",
        },

        {
          field: "fakultas",
          use: "Fakultas",
        },
        {
          field: "jurusan",
          use: "Jurusan",
        },
        {
          field: "actions",
          use: "Actions",
          // use_in_search:false
        },
      ];
      break;
    case "Staff":
      columnNoInduk = "NIP";
      columns = [
        {
          field: "no_induk",
          use: columnNoInduk,
        },
        {
          // use_in_display: false,
          field: "name", //Object destructure
          use: "Name",
        },

        {
          field: "jabatan",
          use: "Jabatan",
          // use_in_search:false
        },
        {
          field: "status",
          use: "Status",
          // use_in_search:false
        },
        {
          field: "actions",
          use: "Actions",
          // use_in_search:false
        },
      ];
      break;
    default:
      columnNoInduk = "No Induk";
      columns = [
        {
          field: "no_induk",
          use: columnNoInduk,
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
      ];
      break;
  }

  return (
    <>
      <div className="rounded-3xl drop-shadow-lg">
        <Table
          // per_page={3}
          row_render={rowcheck}
          styling={tableStyling}
          columns={columns}
          rows={data}
        ></Table>
      </div>

      <Modal
        show={Boolean(modal)}
        size="md"
        popup={true}
        onClose={() => setModal(null)}
      >
        <Modal.Header />

        {/* Delete */}
        {modal === "delete" && (
          <Modal.Body>
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                {selectedUser?.no_induk} - {selectedUser?.name}
              </p>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Apakah anda yakin menghapus akun ini?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDelete}>
                  Ya, saya yakin
                </Button>
                <Button color="gray" onClick={() => setModal(null)}>
                  Tidak, batal
                </Button>
              </div>
            </div>
          </Modal.Body>
        )}

        {/* Update */}
        {modal === "update" && (
          <Modal.Body>
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Update Akun
              </h3>
              <div className="space-y-2">
                <div id="no_induk">
                  <div className="mb-1 block">
                    <Label htmlFor="no_induk" value="NIM/NIP" />
                  </div>
                  <TextInput
                    id="no_induk"
                    placeholder="NIM/NIP"
                    required={true}
                    value={updatedNoInduk}
                    onChange={(e) => setUpdatedNoInduk(e.target.value)}
                  />
                </div>
                <div id="name">
                  <div className="mb-1 block">
                    <Label htmlFor="name" value="Nama" />
                  </div>
                  <TextInput
                    id="name"
                    placeholder="Nama"
                    required={true}
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                </div>
                <div id="phone">
                  <div className="mb-1 block">
                    <Label htmlFor="phone" value="No HP" />
                  </div>
                  <TextInput
                    id="phone"
                    placeholder="No HP"
                    required={true}
                    value={updatedPhone}
                    onChange={(e) => setUpdatedPhone(e.target.value)}
                  />
                </div>
                <div className={role === "Mahasiswa" ? "space-y-2" : "hidden"}>
                  <div id="fakultas">
                    <div className="mb-1 block">
                      <Label htmlFor="fakultas" value="Fakultas" />
                    </div>
                    <Select
                      name="fakultas"
                      id="fakultas"
                      onChange={(e) => setUpdatedFakultas(e.target.value)}
                      value={updatedFakultas}
                    >
                      <option value="">Pilih Fakultas</option>
                      {fakultasData.map((fakultas: IFakultas) => (
                        <option key={fakultas.kode} value={fakultas.name}>
                          {fakultas.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div id="jurusan">
                    <div className="mb-1 block">
                      <Label htmlFor="jurusan" value="Jurusan" />
                    </div>
                    <Select
                      name="jurusan"
                      id="jurusan"
                      onChange={(e) => setUpdatedJurusan(e.target.value)}
                      value={updatedJurusan}
                    >
                      <option value="">Pilih Jurusan</option>
                      {jurusan.map((j: IJurusan, i: number) => (
                        <option key={i} value={j.name}>
                          {j.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className={role === "Staff" ? "space-y-2" : "hidden"}>
                  <div id="jabatan-container">
                    <div className="mb-1 block">
                      <Label htmlFor="jabatan" value="Jabatan" />
                    </div>
                    <TextInput
                      name="jabatan"
                      id="jabatan"
                      onChange={(e) => setUpdatedJabatan(e.target.value)}
                      value={updatedJabatan}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={handleUpdate}>Update Data</Button>
                <Button color="gray" onClick={() => setModal(null)}>
                  Batal
                </Button>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Accounts;
