export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/relatorios/:path*", "/cadastros/:path*", "/"],
};
