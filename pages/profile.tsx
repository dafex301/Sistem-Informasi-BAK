import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useAuth } from "../lib/authContext";

// Function
import { loginWithProvider } from "../firebase/account";

// Icon
import googleIcon from "../public/icons/google.svg";
import facebookIcon from "../public/icons/facebook.svg";
import githubIcon from "../public/icons/github.svg";
import microsoftIcon from "../public/icons/microsoft.svg";
import { getAuth } from "firebase/auth";
import Image from "next/image";

const Profile: NextPage = () => {
  const { user, userData, loading } = useAuth();
  const auth = getAuth();

  console.log(user);
  console.log(userData);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <main>
        <h1>Profile</h1>
        <h1>Name : {userData?.name}</h1>
        <h1>Email : {user?.claims.email}</h1>
        <button
          aria-label="Sync Google Account"
          role="button"
          className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"
          onClick={() => loginWithProvider("google")}
        >
          <Image src={googleIcon} alt={"Google Icon"} />
          <p className="text-base font-medium text-gray-700">
            Sync Google Account
          </p>
        </button>
      </main>
    </>
  );
};

export default Profile;
