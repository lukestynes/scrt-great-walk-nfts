import { type NextRequest, NextResponse } from "next/server";

type WalletRequest = {
  walletAddress: string;
};

export async function POST(request: NextRequest) {
  const { walletAddress } = (await request.json()) as WalletRequest;

  if (!walletAddress) {
    return NextResponse.json(
      { error: "No wallet address provided" },
      { status: 400 },
    );
  }

  // Set the cookie server-side
  const response = NextResponse.json({ success: true });
  response.cookies.set("walletAddress", walletAddress, {
    path: "/",
    httpOnly: true,
    maxAge: 86400,
  });

  return response;
}
