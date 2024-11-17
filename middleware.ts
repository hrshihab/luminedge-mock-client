import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const verify = req.cookies.get("loggedin");
  const url = req.url;

  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/admin/create-schedule",
    "/booking"
  ];

  // Check if the request URL matches any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => url.startsWith(`http://localhost:3000${route}`));

  if (!verify && isProtectedRoute) {
    return NextResponse.redirect("http://localhost:3000/login");
  }

  if (verify && url === "http://localhost:3000/") {
    return NextResponse.redirect("http://localhost:3000/dashboard");
  }
}