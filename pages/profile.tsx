import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useAuth } from "../lib/authContext";

// Function
import { linkWithProvider } from "../firebase/account";

// Icon
import googleIcon from "../public/icons/google.svg";
import facebookIcon from "../public/icons/facebook.svg";
import githubIcon from "../public/icons/github.svg";
import microsoftIcon from "../public/icons/microsoft.svg";
import ConnectButton from "../components/button/ConnectButton";

const Profile: NextPage = () => {
  const { user, userData, loading } = useAuth();

  const providers = user?.claims.firebase.identities;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <main>
        <h1>Profile</h1>
        <h1>Name : {userData?.name}</h1>
        <h1>Email : {user?.claims.email}</h1>
        <ConnectButton
          identities={providers["google.com"]}
          icon={googleIcon}
          provider={"Google"}
          handler={() => linkWithProvider("google")}
        ></ConnectButton>
        <ConnectButton
          identities={providers["facebook.com"]}
          icon={facebookIcon}
          provider={"Facebook"}
          handler={() => linkWithProvider("facebook")}
        ></ConnectButton>
        <ConnectButton
          identities={providers["microsoft.com"]}
          icon={microsoftIcon}
          provider={"Microsoft"}
          handler={() => linkWithProvider("microsoft")}
        ></ConnectButton>
        <ConnectButton
          identities={providers["github.com"]}
          icon={githubIcon}
          provider={"GitHub"}
          handler={() => linkWithProvider("github")}
        ></ConnectButton>
      </main>
    </>
  );
};

export default Profile;
