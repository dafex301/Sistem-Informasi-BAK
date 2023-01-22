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
  Option,
  Select,
} from "@material-tailwind/react";
// import Select from "../../forms/Select";

const Accounts: NextPage = () => {
  // =============== State ===============
  const { user } = useAuth();
  const [data, setData] = useState<DocumentData[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<userAccount | null>(null);

  // =============== Update state ===============
  const [updatedName, setUpdatedName] = useState<string>("");
  const [updatedIdentifier, setUpdatedIdentifier] = useState<string>("");
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [updatedRole, setUpdatedRole] = useState<string | undefined>("UKM");

  // =============== Firebase Query ===============
  // Get all accounts
  const getAccounts = async () => {
    const q: Query = query(
      collection(db, "users"),
      where("role", "!=", "admin"),
      orderBy("role", "asc"),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    const data: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    setData(data);
  };

  useEffect(() => {
    getAccounts();
  }, []);

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
    setUpdatedFakultas(user.fakultas ?? "");
    setUpdatedJurusan(user.jurusan ?? "");
    setUpdatedPhone(user.phone ?? "");
    setUpdatedJabatan(user.jabatan ?? "");
    setUpdatedStatus(user.status ?? "");
    setUpdatedRole(user.role ?? "");

    setModal("update");
  };

  const handleUpdate = () => {};

  const handleCreate = () => {
    // Post to /api/auth/create with identifier, name, and role
    fetch("/api/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization token
        // Authorization: user.token,
      },
      body: JSON.stringify({
        identifier: updatedIdentifier,
        name: updatedName,
        role: updatedRole,
      }),
    }).then((result) => {
      setModal(null);
      handleToast("Create");
      getAccounts();
    });
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
  // useEffect(() => {
  //   if (data.length === 0) {
  //     let tempData: DocumentData[] = [];
  //     const querySnapshot = getDocs(q);
  //     querySnapshot.then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         tempData.push(doc.data());
  //       });

  //       // Filter data to only show data that is not the current user
  //       if (user) {
  //         tempData = tempData.filter((row) => row.email !== user.claims.email);
  //       }

  //       setData(tempData);
  //     });
  //   }
  // });

  // Table Custom Styling based on Role
  let columns = [
    {
      field: "identifier",
      use: "Identifier",
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

  return (
    <>
      <div className="rounded-sm bg-white p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Accounts</h1>
          <button
            className="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-700 mb-3 outline-none hover:outline-none text-sm font-semibold "
            onClick={() => setModal("create")}
          >
            Create Account
          </button>
        </div>
        <Table
          // per_page={3}
          row_render={rowcheck}
          styling={tableStyling}
          columns={columns}
          rows={data}
        ></Table>
      </div>

      <Dialog
        className="w-96 max-w-6xl"
        open={Boolean(modal)}
        handler={() => setModal(null)}
      >
        {/* Create */}
        {(modal === "create" || modal === "update") && (
          <>
            <DialogHeader>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Create Account
              </h3>
            </DialogHeader>
            <DialogBody divider className="flex items-center justify-center">
              <div className="w-9/12 space-y-6 px-6 pb-4 sm:pb-6 lg:px-3 xl:pb-8 xl:pt-8">
                <div className="flex flex-col gap-5">
                  <Input
                    label={"Identifier/Username/NIP"}
                    id="identifier"
                    required={true}
                    value={updatedIdentifier}
                    onChange={(e) => setUpdatedIdentifier(e.target.value)}
                  />
                  <Input
                    label="Nama"
                    id="name"
                    required={true}
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                  <Select
                    variant="outlined"
                    label="Role"
                    value={updatedRole}
                    onChange={(e) => setUpdatedRole(e?.toString())}
                  >
                    <Option value="UKM">Unit Kegiatan Mahasiswa</Option>
                    <Option value="KBAK">
                      Kepala Biro Akademik dan Kemahasiswaan
                    </Option>
                    <Option value="MK">Manager Kemahasiswaan</Option>
                    <Option value="SM">Supervisor Minarpresma</Option>
                    <Option value="TBAK">Tim BAK</Option>
                  </Select>
                </div>

                <div className="flex justify-center gap-4">
                  {modal === "create" ? (
                    <Button onClick={handleCreate}>Create Account</Button>
                  ) : (
                    <Button onClick={handleUpdate}>Update Account</Button>
                  )}
                  <Button color="gray" onClick={() => setModal(null)}>
                    Batal
                  </Button>
                </div>
              </div>
            </DialogBody>
          </>
        )}

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
