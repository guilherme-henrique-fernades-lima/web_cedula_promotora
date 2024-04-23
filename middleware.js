export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/cadastros/:path*",
    "/dashboards/:path*",
    "/relatorios/:path*",
  ],
};
