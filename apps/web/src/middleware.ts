import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the routes that require authentication
const protectedRoutes = {
  staff: ["/staff"],
  renter: ["/dashboard"],
};

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Get the token from localStorage via a cookie (we'll set this in the auth store)
  const token = request.cookies.get("auth_token")?.value;
  const userData = request.cookies.get("user_data")?.value;

  let userRole: string | null = null;
  try {
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      userRole = parsedUserData.role;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    // If user is already logged in and trying to access login page, redirect to appropriate dashboard
    if (pathname === "/login" && token && userRole) {
      if (userRole === "Staff") {
        return NextResponse.redirect(new URL("/staff", request.url));
      } else if (userRole === "Renter") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if user is not authenticated
  if (!token || !userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check staff routes
  if (protectedRoutes.staff.some((route) => pathname.startsWith(route))) {
    if (userRole !== "Staff") {
      // Redirect to appropriate dashboard based on role
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Check renter routes
  if (protectedRoutes.renter.some((route) => pathname.startsWith(route))) {
    if (userRole !== "Renter") {
      // Redirect to staff dashboard
      return NextResponse.redirect(new URL("/staff", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
