import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const steamSession = request.cookies.get("steam_session")
  const isLoggedIn = steamSession?.value === "true"
  const isLoginPage = request.nextUrl.pathname === "/"

  // Skip middleware for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

