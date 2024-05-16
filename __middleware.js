import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { url } = req;
    const requestHeaders = new Headers(req.headers);
    const referer = requestHeaders.get("referer");

    if (url.startsWith("/api/") && !referer) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {},
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = { matcher: ["/:path*"] };
