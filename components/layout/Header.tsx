import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../lib/authContext";
import { signOut } from "../../firebase/account";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

// Image
import avatar from "../../public/avatar.jpg";
import { useState } from "react";

export default function Header(props: any) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [modal, setModal] = useState(false);

  const handleLogout = async () => {
    router.push("/");
    await signOut();
  };

  return (
    <div className="flex justify-end m-5">
      <div className="relative">
        {user ? (
          <>
            <div
              onClick={() => setModal(!modal)}
              className="flex items-center gap-2 cursor-pointer translate-y-1 relative z-10"
            >
              <Image
                src={avatar}
                alt={"Avatar"}
                className="rounded-full w-9 h-9"
              />
              <div className="text-sm">{user.claims.name}</div>
              {modal ? (
                <ChevronUpIcon className="w-4 mt-1" />
              ) : (
                <ChevronDownIcon className="w-4 mt-1" />
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-end m-5"></div>
        )}
        {/* Modal */}
        {modal && (
          <div
            onMouseLeave={() => setModal(false)}
            className="bg-white drop-shadow-md flex flex-col rounded-md text-sm absolute z-10 left-0 top-12 min-w-full"
          >
            <Link
              href="/profile"
              className="flex gap-2 items-center hover:bg-gray-200 rounded-t-md p-2"
            >
              <UserCircleIcon className="w-4" />
              <p className="">Profile</p>
            </Link>
            <button
              onClick={handleLogout}
              className="flex gap-2 hover:bg-gray-200 rounded-b-md items-center p-2"
            >
              <ArrowRightOnRectangleIcon className="w-4" />
              <p className="">Log out</p>
            </button>
          </div>
        )}
        {/* End of Modal */}
      </div>
    </div>
  );
}
