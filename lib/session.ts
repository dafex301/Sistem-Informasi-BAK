import nookies from "nookies";
import { GetServerSidePropsContext, NextApiHandler } from "next";
import admin from "./firebaseConfig/init-admin";
import { jwtVerify } from "jose";
import { verifyToken } from "./jwt/token";

export const authServer = async (ctx: GetServerSidePropsContext) => {
  const { idToken } = nookies.get(ctx);

  try {
    // console.log(await admin.auth().verifyIdToken(idToken));
    return admin.auth().verifyIdToken(idToken);
  } catch (err) {
    return null;
  }
};

export const authDataServer = async (ctx: GetServerSidePropsContext) => {
  const jwt = nookies.get(ctx).user;
  const data = await verifyToken(jwt);

  return data;
};
