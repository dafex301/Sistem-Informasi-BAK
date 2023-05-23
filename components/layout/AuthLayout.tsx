import React from "react";
import Image from "next/image";
import { Props } from "../../interface/props";
import { useAuth } from "../../lib/authContext";
import Loading from "../Loading";
import { useRouter } from "next/router";

export const AuthLayout = ({ children }: Props) => {
  const { loading, user } = useAuth();
  const route = useRouter();

  if (!loading && user) {
    route.push("/dashboard");
  }

  if (!loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Login Container */}
        <div className="min-w-fit flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] ">
          <div className="mb-8 flex flex-col justify-center items-center">
            <Image src="/undip.png" alt={"undip"} width={80} height={80} />
            <h1 className="w-11/12 text-center text-2xl font-medium mt-3">
              Sistem Informasi
            </h1>
            <h1 className="w-11/12 text-center">
              Biro Akademik dan Kemahasiswaan
            </h1>
          </div>
          <div id="child">{children}</div>
          <div className="mt-5 flex text-center text-sm text-gray-400">
            <p>
              Jika terdapat pertanyaan seputar sistem dapat menghubungi
              <br />
              <a
                href="https://instagram.com/dafex30"
                target={"_blank"}
                className="underline"
                rel="noreferrer"
              >
                @dafex30
              </a>{" "}
              via instagram.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <Loading />;
};
