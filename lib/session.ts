import nookies from "nookies";
import { GetServerSidePropsContext, NextApiHandler } from "next";
import adminInit from "./firebaseConfig/init-admin";
import * as jose from "jose";
import { UserData } from "./authContext";

export const authServer = async (ctx: GetServerSidePropsContext) => {

  const { idToken } = nookies.get(ctx);

  try {
    return adminInit.auth().verifyIdToken(idToken);
  } catch (err) {
    return null;
  }
};

export const authDataServer = async (ctx: GetServerSidePropsContext) => {
  const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_KEY,
  )
  const jwt = nookies.get(ctx).user

  const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret, {
    issuer: 'dafex',
    audience: 'sistem-informasi-bak',
  })

  const userData = {
    name: payload.name,
    nim: payload.nim,
    role: payload.role,
  }

  return userData;
}