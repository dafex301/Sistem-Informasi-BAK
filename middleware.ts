import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import verifyToken from "./lib/jwt/verifyToken";

export async function middleware(request: NextRequest) {
  let res = NextResponse.next();
  const requestPath = request.nextUrl.pathname;
  const userToken = request.cookies.get("user")?.value;
  let user;

  if (userToken) {
    user = await verifyToken(userToken);
  }

  if (requestPath.startsWith("/auth")) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return res;
}
