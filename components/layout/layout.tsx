import Header from "./Header";
import Footer from "./Footer";
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

export default function Layout({ children }: Props) {
  const { user, loading } = useAuth();
  const route = useRouter();
  const role = user?.claims.role;

  const [showSidebar, setShowSidebar] = useState(true);

  // if (!loading && !user) {
  //   route.push("/auth/login");
  // }

  if (!loading && user) {
    return (
      <>
        <div className="flex">
          {/* Sidebar */}
          <div
            className={
              showSidebar ? "min-w-max bg-gray-900 flex-col" : "hidden"
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
              {/* Main Menu */}
              <div>
                <p className="text-xs mx-3 mb-2 text-gray-600">Menu Utama</p>
                <SidebarMenu
                  href={"/"}
                  solidIcon={<SquaresSolid />}
                  outlineIcon={<SquaresOutline />}
                  text={"Dashboard"}
                />
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
                    href={"/admin"}
                    solidIcon={<SquaresSolid />}
                    outlineIcon={<SquaresOutline />}
                    text={"Dashboard Admin"}
                  />
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
            </div>
          </div>
          {/* End of Sidebar */}
          <div className="w-full">
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
