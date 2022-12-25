import nookies from "nookies";
import { GetServerSidePropsContext, NextApiHandler } from "next";
import adminInit from "./firebaseConfig/init-admin";
import { jwtVerify } from "jose";
import { UserData } from "./authContext";
import verifyToken from "./jwt/token";

export const authServer = async (ctx: GetServerSidePropsContext) => {
  const { idToken } = nookies.get(ctx);

  try {
    return adminInit.auth().verifyIdToken(idToken);
  } catch (err) {
    return null;
  }
};

export const authDataServer = async (ctx: GetServerSidePropsContext) => {
  const jwt = nookies.get(ctx).user;
  const data = await verifyToken(jwt);

  const userData = {
    name: data.name,
    no_induk: data.no_induk,
    role: data.role,
  };

  return userData;
};
