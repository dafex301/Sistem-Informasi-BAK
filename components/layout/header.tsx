import { useAuth } from "../../lib/authContext";
import Link from "next/link";
import { signOut } from "../../firebase/account";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

export default function Header(props: any) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-full justify-end ">
      <div className="">
        {!user && !loading ? (
          <>
            <Link passHref href="/auth/register">
              <button className="m-auto"> Register</button>
            </Link>

            <Link passHref href="/auth/login">
              <button className="m-auto"> Login</button>
            </Link>
          </>
        ) : null}
        {user ? (
          <>
            <Link href="/profile">
              <button> Profile</button>
            </Link>

            <Link href="/private">
              <button> Private</button>
            </Link>

            <button onClick={handleLogout}> Signout</button>
          </>
        ) : null}
      </div>
    </div>
  );
}
