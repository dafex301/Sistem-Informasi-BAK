import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAuth } from "../lib/authContext";

const Home: NextPage = () => {
  const { user, userData, loading } = useAuth();
  const [role, setRole] = useState<string>("");
  const addRole = async () => {
    const res = await fetch("/api/auth/roles/dosen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user?.claims.user_id }),
    });
    const data = await res.json();
  };

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border border-red-500"
        type="text"
      />
      <button onClick={addRole}>Submit</button>

      <main>Sweet home</main>
    </>
  );
};

export default Home;
