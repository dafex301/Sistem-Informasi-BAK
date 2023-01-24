import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../lib/authContext";
import { signOut } from "../../firebase/account";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

// Image
import avatar from "../../public/images/avatar.png";

export default function Header(props: any) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-end">
      <div className="">
        {user ? (
          <>
            <Link href="/profile">
              <button> Profile</button>
            </Link>

            <button onClick={handleLogout}> Signout</button>
          </>
        ) : null}
      </div>
    </div>
  );
}
