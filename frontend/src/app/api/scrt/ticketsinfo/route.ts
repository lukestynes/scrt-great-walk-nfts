import { getSecretJsClient } from "@/app/utils/secretjs";
import { env } from "@/env";
import { type NextRequest, NextResponse } from "next/server";

type TokenResponse = {
  token_list: { tokens: string[] };
};

// Helper function to get NFT info for a specific token ID
async function getNFTInfo(tokenId: string) {
  try {
    const secretjs = getSecretJsClient();
    const query = await secretjs.query.compute.queryContract({
      contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      query: {
        nft_info: { token_id: tokenId },
      },
    });
    return { token_id: tokenId, nft_info: query };
  } catch (error) {
    console.error(`Error fetching info for token ID: ${tokenId}`, error);
    throw new Error(`Failed to fetch info for token ${tokenId}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Getting all tickets and their details");

    // Get cookies from the request
    const cookies = request.cookies;
    const walletAddress = cookies.get("walletAddress")?.value;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "No wallet address found in cookies" },
        { status: 400 },
      );
    }

    const secretjs = getSecretJsClient();

    // Step 1: Get the list of token IDs owned by the user
    const tokensQuery: TokenResponse =
      await secretjs.query.compute.queryContract({
        contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        query: {
          tokens: { owner: walletAddress },
        },
      });

    const tokenIds = tokensQuery.token_list.tokens;

    if (tokenIds.length === 0) {
      return NextResponse.json({ message: "No tickets found for this user" });
    }

    // Step 2: Fetch NFT details for each token
    const nftInfoPromises = tokenIds.map((tokenId) => getNFTInfo(tokenId));
    const nftDetails = await Promise.all(nftInfoPromises);

    // Step 3: Return the NFT details as the response
    return NextResponse.json(nftDetails);
  } catch (error) {
    console.error("Error fetching tickets and NFT info:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets and NFT info" },
      { status: 500 },
    );
  }
}
