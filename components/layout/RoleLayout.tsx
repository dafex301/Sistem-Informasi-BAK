import React from "react";
import { useAuth } from "../../lib/authContext";
import Loading from "../Loading";
import { useRouter } from "next/router";

export type Props = {
  children: React.ReactNode;
  role?: string;
  roleList?: string[];
};

export const RoleLayout = (props: Props) => {
  const { loading, user } = useAuth();
  const route = useRouter();

  if (!loading && props.role && user?.claims.role === props.role) {
    return props.children;
  }

  if (
    !loading &&
    props.roleList &&
    props.roleList.includes(user?.claims.role)
  ) {
    return props.children;
  }

  if (!loading && user) {
    route.push("/");
  }

  return <Loading />;
};
