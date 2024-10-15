import { getSecretJsClient } from "@/app/utils/secretjs";
import { env } from "@/env";
import { NextResponse } from "next/server";

// const secretjs = new SecretNetworkClient({
//   url: env.RPC_URL,
//   chainId: env.CHAIN_ID,
//   wallet: wallet,
//   walletAddress: wallet.address,
// });

export async function GET() {
  try {
    console.log("Trying to query the contract for it's walk info");

    const secretjs = getSecretJsClient();

    // Query the walk data
    const query = await secretjs.query.compute.queryContract({
      contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      code_hash: env.NEXT_PUBLIC_CODE_HASH,
      query: { walk_info: {} },
    });

    console.log("Response: ", query);

    return NextResponse.json(query);
  } catch (error) {
    console.error("Error querying walk data:", error);
    return NextResponse.json({ error: "Failed to query contract" });
  }
}
