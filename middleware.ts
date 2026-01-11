export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/reports/:path*",
    "/admin/:path*",
  ],
};



