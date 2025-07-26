import axios from "axios";

const { NextResponse } = require("next/server");

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  try {
    const cookieHeader = request.headers.get("cookie");
    let token = null,
      id = null;

    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c) => c.trim().split("="))
      );
      token = cookies["token"];
      id = cookies["userId"];
    }

    if (!token || !id) {
      return goto("/login", request);
    }

    const baseUrl = request.nextUrl.origin;
    const res = await axios.get(`${baseUrl}/api/auth`, {
      headers: { userid: id, token, "Cache-Control": "no-store" },
    });

    if (res.data.status !== true) {
      return goto("/login", request);
    }

    return NextResponse.next();
  } catch (error) {
    return goto("/login", request);
  }
}

const goto = (path, request) => {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.headers.set("Cache-Control", "no-store");
  return response;
};

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
