import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup"]; 

export default function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token"); 
  
  const isPublicRoute = publicRoutes.some((path) => url.pathname.startsWith(path));

  // Redirect to login if not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect to home if authenticated and trying to access login/signup
  if (token && isPublicRoute) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
