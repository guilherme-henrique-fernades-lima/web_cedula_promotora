import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const requestHeaders = new Headers(req.headers);
    const referer = requestHeaders.get("referer");
    const isAuthenticated = !!req.nextauth.token;
    const { pathname } = req.nextUrl;

    console.error("Error message");

    console.log(">>>>>>>> Pathname.......: ", pathname);
    console.log(">>>>>>>> isAuthenticated: ", isAuthenticated);

    // if (req.url.startsWith("/api/") && !referer) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // console.log("0 - Entrou");
    // if (isAuthenticated) {
    //   console.log("1 - Entrou");
    //   if (req.nextUrl.pathname.startsWith("/auth") && isAuthenticated) {
    //     console.log("2 - Entrou");
    //     return NextResponse.redirect(new URL("/", req.url));
    //   }

    //   return NextResponse.next({ request: { headers: requestHeaders } });
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) {
          return true;
        } else {
          return false;
        }
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/auth/login",
    "/((?!_next/static|_next/image|public/|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
