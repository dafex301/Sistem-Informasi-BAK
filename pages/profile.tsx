import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useAuth } from "../lib/authContext";
import PageTitle from "../components/layout/PageTitle";
import PageBody from "../components/layout/PageBody";
import Input from "../components/forms/Input";
import { updatePassword, getAuth } from "firebase/auth";

// Firebase
import { query, collection, where, getDoc } from "firebase/firestore";
import { getUserByUserId, updateUser, UserData } from "../firebase/account";
import { toast, ToastContainer } from "react-toastify";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";

const Profile: NextPage = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    identifier: "",
    email: "",
    role: "",
    pic: "",
    contact: "",
  });
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
    error: "",
  });
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (user) {
      getUserByUserId(user!.claims.user_id).then((res) => {
        setUserData(res!);
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    await updateUser(user!.claims.user_id, userData!)
      .then(() => {
        toast.success(`Update account berhasil`);
      })
      .catch((err) => {
        toast.error(`Update account gagal: ${err}`);
      });
  };

  const handleChangePassword = async () => {
    if (newPassword.password !== newPassword.confirmPassword) {
      setNewPassword((prev) => ({
        ...prev,
        error: "Password tidak sama",
      }));
      return;
    }

    const auth = getAuth();
    setModal(false);
    await updatePassword(auth.currentUser!, newPassword.password)
      .then(() => {
        toast.success(`Update password berhasil`);
      })
      .catch((err) => {
        toast.error(`Update password gagal: ${err}`);
      });
  };

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageTitle>User Profile</PageTitle>
      <PageBody>
        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={user?.claims.picture || "/avatar.jpg"}
              width={128}
              height={128}
              alt="Avatar"
              className="rounded-full w-32 h-32"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user?.claims.name}</h1>
            <p className="text-sm text-gray-500">{user?.claims.role}</p>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <div className="grid grid-cols-2 gap-12">
            <Input
              id="nama"
              type="text"
              placeholder="Nama"
              value={user?.claims.name}
              disabled
              label="Nama"
              error=""
              onChange={() => {}}
            />

            <Input
              id="identifier"
              type="text"
              placeholder="Identifier"
              value={userData?.identifier!}
              disabled
              label="Identifier"
              error=""
              onChange={() => {}}
            />

            {user?.claims.role === "ORMAWA" && (
              <>
                <Input
                  id="pic"
                  type="text"
                  placeholder="Penanggung Jawab"
                  value={userData?.pic!}
                  label="Penanggung Jawab"
                  error=""
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      pic: e.target.value,
                    }));
                  }}
                />
                <Input
                  id="contact"
                  type="tel"
                  placeholder="Kontak"
                  value={userData?.contact!}
                  label="Kontak"
                  error=""
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      contact: e.target.value,
                    }));
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center flex-col items-center">
          <button
            onClick={handleUpdate}
            className="bg-black text-white rounded py-3 px-4 mt-5 w-36 hover:bg-gray-900"
          >
            Update User
          </button>
          <button
            onClick={() => {
              setModal(true);
            }}
            className="bg-gray-100 text-gray-800 rounded py-3 px-4 mt-5 w-36 hover:bg-gray-200"
          >
            Ubah Password
          </button>
        </div>
      </PageBody>

      <Dialog
        open={modal}
        handler={() => {
          setModal(false);
        }}
      >
        <>
          <DialogHeader>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Change Password
            </h3>
          </DialogHeader>
          <DialogBody divider className="flex items-center justify-center">
            <div className="w-9/12 space-y-6 px-6 pb-4 sm:pb-6 lg:px-3 xl:pb-8 xl:pt-8">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <Input
                    label={"Password"}
                    error={newPassword.error}
                    type="password"
                    id="password"
                    required={true}
                    value={newPassword.password}
                    onChange={(e) =>
                      setNewPassword((prev) => ({
                        ...prev,
                        password: e.target.value,
                        error: "",
                      }))
                    }
                  />
                  <Input
                    label={"Konfirmasi Password"}
                    error={newPassword.error}
                    type="password"
                    id="password-confirmation"
                    required={true}
                    value={newPassword.confirmPassword}
                    onChange={(e) =>
                      setNewPassword((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                        error: "",
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setModal(false)}
                  className="bg-gray-100 text-gray-800 rounded py-3 px-4 mt-5 w-36 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleChangePassword}
                  className="bg-black text-white rounded py-3 px-4 mt-5 w-36 hover:bg-gray-900"
                >
                  Ubah Password
                </button>
              </div>
            </div>
          </DialogBody>
        </>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default Profile;
