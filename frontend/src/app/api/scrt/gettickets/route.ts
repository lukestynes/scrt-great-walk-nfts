import { getSecretJsClient } from "@/app/utils/secretjs";
import { env } from "@/env";
import { type NextRequest, NextResponse } from "next/server";

type TokenResponse = {
  token_list: { tokens: string[] };
};

export async function GET(request: NextRequest) {
  try {
    console.log("Getting tickets owned by this owner");

    const cookies = request.cookies;
    const walletAddress = cookies.get("walletAddress")?.value;

    const secretjs = getSecretJsClient();

    // Get the tickets id's owned
    const query: TokenResponse = await secretjs.query.compute.queryContract({
      contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      code_hash: env.NEXT_PUBLIC_CODE_HASH,
      query: {
        tokens: { owner: walletAddress },
      },
    });

    return NextResponse.json(query.token_list.tokens);
  } catch (error) {
    console.error("Error querying nft info:", error);
    return NextResponse.json({ error: "Failed to query contract" });
  }
}
