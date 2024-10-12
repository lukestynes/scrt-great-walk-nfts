import { NextResponse } from "next/server";

export async function GET() {
  // Clear the walletAddress cookie by setting its Max-Age to 0
  const response = NextResponse.json({ success: true });
  response.cookies.set("walletAddress", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
