import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../lib/authContext";
import Loading from "../Loading";
import { useRouter } from "next/router";
import { Props } from "../../interface/props";

export default function Layout({ children }: Props) {
  const { user, loading } = useAuth();
  const route = useRouter();

  // if (!loading && !user) {
  //   route.push("/auth/login");
  // }

  if (!loading) {
    return (
      <>
        <div className="bg-gray-50">
          <div
            className="flex flex-col min-h-screen container mx-auto md:w-11/12  lg:w-4/5
      divide-y divide-black-500 "
          >
            <div className=" h-16 ">
              <Header />
            </div>
            <div className="flex-grow m-5">{children}</div>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  return <Loading />;
}
