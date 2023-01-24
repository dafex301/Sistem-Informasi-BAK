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
  const [updatedRole, setUpdatedRole] = useState<string | undefined>("UKM");
  const [errorIdentifier, setErrorIdentifier] = useState<string>("");
  const [errorName, setErrorName] = useState<string>("");

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

  useEffect(() => {
    // Set error to empty string when modal is closed
    if (modal === null) {
      setErrorIdentifier("");
      setErrorName("");
    }
  }, [modal]);

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

  const handleDeleteButton = (user: any) => {
    setSelectedUser(user);
    setModal("delete");
  };

  const handleDelete = () => {
    if (user && selectedUser) {
      const { id } = selectedUser;
      fetch(`/api/admin/accounts/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        });

      let tempData = data.filter((row) => row.id !== id);
      setData(tempData);
      setModal(null);
      handleToast("Delete");
    }
  };

  const handleCreateButton = () => {
    setUpdatedName("");
    setUpdatedIdentifier("");
    setUpdatedRole("UKM");
    setModal("create");
  };

  const handleUpdateButton = (user: any) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedIdentifier(user.identifier);
    setUpdatedRole(user.role ?? "");

    setModal("update");
  };

  const handleUpdate = () => {
    if (updatedIdentifier.length < 6) {
      setErrorIdentifier("Username minimal 6 karakter");
      return;
    } else {
      setErrorIdentifier("");
    }

    // Check if name is valid
    if (updatedName.length < 1) {
      setErrorName("Nama wajib diisi!");
      return;
    } else {
      setErrorName("");
    }

    fetch("/api/admin/accounts/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization token
        Authorization: user!.token,
      },
      body: JSON.stringify({
        id: selectedUser?.id,
        identifier: updatedIdentifier,
        name: updatedName,
        role: updatedRole,
      }),
    });
    setModal(null);
    handleToast("Update");

    let tempData = data.map((row) => {
      if (row.id === selectedUser?.id) {
        return {
          ...row,
          identifier: updatedIdentifier,
          name: updatedName,
          role: updatedRole,
        };
      }
      return row;
    });
    setData(tempData);
  };
  const handleCreate = () => {
    if (updatedIdentifier.length < 6) {
      setErrorIdentifier("Username minimal 6 karakter");
      return;
    } else {
      setErrorIdentifier("");
    }

    // Check if name is valid
    if (updatedName.length < 1) {
      setErrorName("Nama wajib diisi!");
      return;
    } else {
      setErrorName("");
    }

    fetch("/api/admin/accounts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization token
        Authorization: user!.token,
      },
      body: JSON.stringify({
        identifier: updatedIdentifier,
        name: updatedName,
        role: updatedRole,
      }),
    });
    setModal(null);
    handleToast("Create");

    setData([
      ...data,
      {
        identifier: updatedIdentifier,
        name: updatedName,
        role: updatedRole,
      },
    ]);
  };

  // ================== Toast ==================
  const handleToast = (status: string) => {
    toast.success(`${status} account berhasil`, {
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

  // Table Custom Styling based on Role
  let columns = [
    {
      field: "identifier",
      use: "Username/NIP",
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
          <Button onClick={handleCreateButton}>Create Account</Button>
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
                  <div>
                    <Input
                      label={"Identifier/Username/NIP"}
                      error={Boolean(errorIdentifier)}
                      id="identifier"
                      required={true}
                      value={updatedIdentifier}
                      onChange={(e) => setUpdatedIdentifier(e.target.value)}
                    />
                    {errorIdentifier && (
                      <p className="text-red-500 text-xs">{errorIdentifier}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      error={Boolean(errorName)}
                      label="Nama"
                      id="name"
                      required={true}
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                    {errorName && (
                      <p className="text-red-500 text-xs">{errorName}</p>
                    )}
                  </div>

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
                {selectedUser?.identifier} - {selectedUser?.name}
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
