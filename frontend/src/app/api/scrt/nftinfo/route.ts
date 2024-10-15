import { getSecretJsClient } from "@/app/utils/secretjs";
import { env } from "@/env";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Trying to query the contract for it's token info");

    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId");

    if (!tokenId) {
      return NextResponse.json({ error: "Missing tokenId" }, { status: 400 });
    }

    const secretjs = getSecretJsClient();

    // Query the walk data
    const query = await secretjs.query.compute.queryContract({
      contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      code_hash: env.NEXT_PUBLIC_CODE_HASH,
      query: {
        nft_info: { token_id: tokenId },
      },
    });

    console.log("Response: ", query);

    return NextResponse.json(query);
  } catch (error) {
    console.error("Error querying nft info:", error);
    return NextResponse.json({ error: "Failed to query contract" });
  }
}
