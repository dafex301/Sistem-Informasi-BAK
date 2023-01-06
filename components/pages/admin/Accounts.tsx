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
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { Irender_row } from "../../../interface/table";
import { tableStyling } from "../../table/tableStyling";
import { useAuth } from "../../../lib/authContext";
import { userAccount } from "../../../interface/userAccount";
import { IFakultas } from "../../../interface/fakultas";
import { IJurusan } from "../../../interface/jurusan";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Chip,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  Switch,
} from "@material-tailwind/react";
import Select from "../../forms/Select";

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
  const [updatedRole, setUpdatedRole] = useState<string>("");

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
          <Chip
            value={row.status}
            className={
              row.status === "Aktif"
                ? "bg-green-500 px-2 font-normal"
                : "bg-red-500 px-2 font-normal"
            }
          />
        </>
      );
    }

    if (column.field === "name") {
      return (
        <div className="flex items-center gap-2">
          <p className="font-semibold">{display_value}</p>
          {row.role === "Admin" && (
            <CheckBadgeIcon className="text-blue-500 w-4" />
          )}
        </div>
      );
    }

    if (column.field === "actions") {
      return (
        <div className="flex gap-1">
          <Button
            className="p-3 hover:bg-blue-700"
            onClick={() => handleUpdateButton(row)}
          >
            <PencilIcon className="w-5" />
          </Button>
          <Button
            className="p-3 hover:bg-red-700"
            color="red"
            onClick={() => handleDeleteButton(row)}
          >
            <TrashIcon className="w-5 " />
          </Button>
        </div>
      );
    }

    return display_value;
  };

  // =============== Handler ===============
  const handleStatusSwitch = () => {
    if (selectedUser) {
      if (updatedStatus === "Aktif") {
        setUpdatedStatus("Nonaktif");
        setUpdatedRole("Staff");
      } else {
        setUpdatedStatus("Aktif");
      }
    }
  };

  const handleRoleSwitch = () => {
    if (selectedUser && updatedStatus === "Aktif") {
      setUpdatedRole(updatedRole === "Admin" ? "Staff" : "Admin");
    }
  };

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
    setUpdatedStatus(user.status ?? "");
    setUpdatedRole(user.role ?? "");

    setModal("update");
  };

  const handleUpdate = () => {
    if (user && selectedUser) {
      const { email } = selectedUser;
      // Request to /api/auth/update with email as body
      if (role === "Mahasiswa") {
        fetch(`/api/auth/mahasiswa/update`, {
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
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
          });
      } else if (role === "Staff") {
        fetch(`/api/auth/staff/update`, {
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
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
          });
      }

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

  const handleUpdateFakultas = (fakultas: string) => {
    setUpdatedFakultas(fakultas);
    const jurusan = jurusanData.filter(
      (row: IJurusan) => row.faculty === fakultas
    );
    setUpdatedJurusan(jurusan[0].name);
  };

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
          use: "Nama",
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
          use: "Nama",
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
          use: "Nama",
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

      <Dialog open={Boolean(modal)} handler={() => setModal(null)}>
        {/* Delete */}
        {modal === "delete" && (
          <DialogBody className="flex items-center justify-center">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                {selectedUser?.no_induk} - {selectedUser?.name}
              </p>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Apakah anda yakin menghapus akun ini?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={handleDelete}>
                  Ya, saya yakin
                </Button>
                <Button color="gray" onClick={() => setModal(null)}>
                  Tidak, batal
                </Button>
              </div>
            </div>
          </DialogBody>
        )}

        {/* Update */}
        {modal === "update" && (
          <>
            <DialogHeader>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Update Akun
              </h3>
            </DialogHeader>
            <DialogBody divider className="flex items-center justify-center">
              <div className="w-9/12 space-y-6 px-6 pb-4 sm:pb-6 lg:px-3 xl:pb-8 xl:pt-8">
                <div className="">
                  <div className="flex flex-col gap-5">
                    <Input
                      label={role === "Mahasiswa" ? "NIM" : "NIP"}
                      id="no_induk"
                      required={true}
                      value={updatedNoInduk}
                      onChange={(e) => setUpdatedNoInduk(e.target.value)}
                    />
                    <Input
                      label="Nama"
                      id="name"
                      required={true}
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                    <Input
                      id="no-hp"
                      label="No HP"
                      required={true}
                      value={updatedPhone}
                      onChange={(e) => setUpdatedPhone(e.target.value)}
                    />
                    <div
                      className={
                        role === "Staff" ? "flex flex-col gap-5" : "hidden"
                      }
                    >
                      <Input
                        name="jabatan"
                        id="jabatan"
                        onChange={(e) => setUpdatedJabatan(e.target.value)}
                        label="Jabatan"
                        value={updatedJabatan}
                      />
                      <Switch
                        id="status-switch"
                        defaultChecked={updatedStatus === "Aktif"}
                        onClick={handleStatusSwitch}
                        label="Aktif"
                      />
                      <Switch
                        containerProps={
                          updatedStatus === "Nonaktif"
                            ? { className: "cursor-not-allowed" }
                            : {}
                        }
                        labelProps={
                          updatedStatus === "Nonaktif"
                            ? { className: "cursor-not-allowed" }
                            : {}
                        }
                        circleProps={
                          updatedStatus === "Nonaktif"
                            ? { className: "cursor-not-allowed" }
                            : {}
                        }
                        disabled={updatedStatus === "Nonaktif" ? true : false}
                        checked={updatedRole === "Admin"}
                        className="cursor-not-allowed"
                        id="role-switch"
                        onClick={handleRoleSwitch}
                        label="Admin"
                      />
                    </div>
                  </div>
                  <div className={role === "Mahasiswa" ? "" : "hidden"}>
                    <Select
                      label="Fakultas"
                      value={updatedFakultas}
                      onChange={(e) => setUpdatedFakultas(e.target.value)}
                    >
                      {fakultasData.map((fakultas: IFakultas) => (
                        <option key={fakultas.kode} value={fakultas.name}>
                          {fakultas.name}
                        </option>
                      ))}
                    </Select>
                    <Select
                      label="Jurusan"
                      onChange={(e) => setUpdatedJurusan(e.target.value)}
                      value={updatedJurusan}
                    >
                      {jurusanData
                        .filter(
                          (jurusan: IJurusan) =>
                            jurusan.faculty === updatedFakultas
                        )
                        .map((jurusan: IJurusan) => (
                          <option
                            className=""
                            key={jurusan.name}
                            value={jurusan.name}
                          >
                            {jurusan.name}
                          </option>
                        ))}
                    </Select>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={handleUpdate}>Update Data</Button>
                  <Button color="gray" onClick={() => setModal(null)}>
                    Batal
                  </Button>
                </div>
              </div>
            </DialogBody>
          </>
        )}
      </Dialog>

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
