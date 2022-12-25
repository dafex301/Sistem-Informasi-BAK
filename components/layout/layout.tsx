import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../lib/authContext";
import Loading from "../Loading";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { user, userData, loading } = useAuth();
  const route = useRouter();

  if (!loading && !user) {
    route.push("/auth/login");
  }
  if (!loading && user) {
    <>
      <div
        className="flex flex-col min-h-screen container mx-auto md:w-11/12  lg:w-4/5
      divide-y divide-black-500"
      >
        <div className=" h-16 ">
          <Header />
        </div>
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </>;
  }

  return <Loading />;
}
