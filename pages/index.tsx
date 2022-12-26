import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAuth } from "../lib/authContext";

const Home: NextPage = () => {
  const { user, userData, loading } = useAuth();
  const [role, setRole] = useState<string>("");
  const testRequest = async () => {
    if (user) {
      const res = await fetch("/api/auth/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({ user_id: user.claims.user_id }),
      });
      const data = await res.json();
      console.log(data);
    }
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
      <button onClick={testRequest}>Submit</button>

      <main>Sweet home</main>
    </>
  );
};

export default Home;
