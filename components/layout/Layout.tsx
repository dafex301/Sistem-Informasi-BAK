import Header from "./Header";
import { useAuth } from "../../lib/authContext";
import Loading from "../Loading";
import { useRouter } from "next/router";
import { Props } from "../../interface/props";
import Image from "next/image";

// Image
import undip from "../../public/undip.png";

// Font
import { Montserrat } from "@next/font/google";

// Logo
import {
  BuildingOfficeIcon as BuildingOutline,
  Squares2X2Icon as SquaresOutline,
  BanknotesIcon as BankOutline,
  UserIcon as UserOutline,
  BuildingOffice2Icon as Building2Outline,
  CurrencyDollarIcon as DollarOutline,
} from "@heroicons/react/24/outline";
import {
  BuildingOfficeIcon as BuildingSolid,
  Squares2X2Icon as SquaresSolid,
  BanknotesIcon as BankSolid,
  UserIcon as UserSolid,
  BuildingOffice2Icon as Building2Solid,
  CurrencyDollarIcon as DollarSolid,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import SidebarMenu from "../sidebar/SidebarMenu";
import { useState } from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

const verifikatorRuang = ["KBAK", "MK", "SM", "TBAK"];

export default function Layout({ children }: Props) {
  const { user, loading } = useAuth();
  const route = useRouter();
  const role = user?.claims.role;

  const [showSidebar, setShowSidebar] = useState(true);

  if (!loading && !user) {
    route.push("/auth/login");
  }

  if (!loading && user) {
    return (
      <>
        <div className="flex">
          {/* Sidebar */}
          <div
            className={
              showSidebar
                ? "min-w-max h-screen bg-gray-900 flex-col sticky top-0"
                : "hidden"
            }
          >
            {/* Logo */}
            <Link
              href={"/"}
              className="flex gap-3 items-center justify-center mt-5 px-14 mx-1"
            >
              <Image src={undip} alt={"Undip"} className="w-10" />
              <div className={montserrat.className}>
                <h1 className="text-white text-xl font-bold">SI-BAK</h1>
              </div>
            </Link>
            {/* End of Logo */}

            {/* Menu */}
            <div className="flex flex-col gap-8 mt-12 mx-2 text-gray-500">
              <SidebarMenu
                dashboard
                href={"/"}
                solidIcon={<SquaresSolid />}
                outlineIcon={<SquaresOutline />}
                text={"Dashboard"}
              />
              {/* Main Menu */}
              <div>
                <p className="text-xs mx-3 mb-2 text-gray-600">Menu Utama</p>
                <SidebarMenu
                  href={"/peminjaman"}
                  solidIcon={<BuildingSolid />}
                  outlineIcon={<BuildingOutline />}
                  text={"Permohonan Peminjaman"}
                />
                <SidebarMenu
                  href={"/proposal"}
                  solidIcon={<BankSolid />}
                  outlineIcon={<BankOutline />}
                  text={"Pengajuan Proposal & Dana"}
                />
              </div>
              {/* End of Main Menu */}

              {/* Admin Menu */}
              {role === "admin" && (
                <div>
                  <p className="text-xs mx-3 mb-2 text-gray-600">Menu Admin</p>
                  <SidebarMenu
                    href={"/admin/accounts"}
                    solidIcon={<UserSolid />}
                    outlineIcon={<UserOutline />}
                    text={"Manajemen Akun"}
                  />
                  <SidebarMenu
                    href={"/admin/peminjaman"}
                    solidIcon={<Building2Solid />}
                    outlineIcon={<Building2Outline />}
                    text={"Manajemen Peminjaman"}
                  />
                  <SidebarMenu
                    href={"/admin/proposal"}
                    solidIcon={<DollarSolid />}
                    outlineIcon={<DollarOutline />}
                    text={"Manajemen Proposal"}
                  />
                </div>
              )}
              {/* End of Admin Menu */}

              {/* Staff Menu */}
              {verifikatorRuang.includes(role) && (
                <div>
                  <p className="text-xs mx-3 mb-2 text-gray-600">Menu Staff</p>
                  <SidebarMenu
                    href={"/staff/peminjaman/data"}
                    solidIcon={<Building2Solid />}
                    outlineIcon={<Building2Outline />}
                    text={"Data Peminjaman"}
                  />
                  <SidebarMenu
                    href={"/staff/peminjaman/verifikasi"}
                    solidIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                    outlineIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                        />
                      </svg>
                    }
                    text={"Verifikasi Peminjaman"}
                  />
                </div>
              )}
              {/* End of Staff Menu */}

              {/* UKM Menu */}

              {role === "UKM" && (
                <div>
                  <p className="text-xs mx-3 mb-2 text-gray-600">Menu UKM</p>
                  <SidebarMenu
                    href={"/ukm/peminjaman"}
                    solidIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                    outlineIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                        />
                      </svg>
                    }
                    text={"Manajemen Peminjaman"}
                  />
                  <SidebarMenu
                    href={"/ukm/proposal"}
                    solidIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                    outlineIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                    text={"Manajemen Proposal"}
                  />
                </div>
              )}

              {/* End of UKM Menu */}
            </div>
          </div>
          {/* End of Sidebar */}
          <div className="w-full mb-5">
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="">{children}</div>
              {/* <Footer /> */}
            </div>
          </div>
        </div>
      </>
    );
  }

  return <Loading />;
}
