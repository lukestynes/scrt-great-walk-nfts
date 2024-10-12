import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Grab the wallet address from the cookie
  const walletAddress = request.cookies.get("walletAddress");

  const { pathname } = request.nextUrl;

  // Allow access to the login page, Keplr connection routes, and public assets
  if (
    pathname === "/login" ||
    pathname.startsWith("/api") ||
    pathname === "/"
  ) {
    return NextResponse.next(); // Continue to the requested page
  }

  // If user is not authenticated, redirect to the login page
  if (!walletAddress) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next/static|_next/image|_next/public|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
