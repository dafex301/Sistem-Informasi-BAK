import { useAuth } from "../../lib/authContext";
import Link from "next/link";
import { signOut } from "../../firebase/account";
import { useRouter } from "next/router";

export default function Header(props: any) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut().then(() => {
      router.push("/auth/login");
    });
  };

  return (
    <div className="flex h-full flex-row">
      <div className="flex-1 my-auto">
        <Link href="/">
          <button>Home</button>
        </Link>
      </div>

      <div className="m-auto space-x-2">
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
            <Link href="/privatessr">
              <button> PrivateSSR</button>
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
