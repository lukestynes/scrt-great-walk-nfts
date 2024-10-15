import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { getSecretJsClient, newPermit } from "@/app/utils/secretjs";

type MintTicketRequest = {
  token_id: number;
  walk_date: string;
};

export async function POST(request: NextRequest) {
  try {
    console.log("Attempting to mint a ticket for a walk");
    const cookies = request.cookies;
    const walletAddress = cookies.get("walletAddress")?.value;

    if (!walletAddress) {
      console.log("Request not authorised");
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    console.log("WALLET ADDRESS: ", walletAddress);

    const secretjs = getSecretJsClient();
    const body = (await request.json()) as MintTicketRequest;

    const { token_id, walk_date } = body;

    if (!token_id || !walk_date) {
      console.log("Missing token_id or date");
      return NextResponse.json(
        { error: "Bad Request: token_id and date are required." },
        { status: 400 },
      );
    }

    const mintMsg = {
      mint_nft: {
        token_id: token_id,
        serial_number: null,
        royalty_info: null,
        transferable: true,
        memo: "Minting Routeburn Track NFT",
        walk_date: walk_date,
      },
    };

    // Mint the thing
    const tx = await secretjs.tx.compute.executeContract(
      {
        sender: env.NEXT_PUBLIC_ADMIN_WALLET,
        contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        code_hash: env.NEXT_PUBLIC_CODE_HASH,
        msg: mintMsg,
        sent_funds: [],
      },
      {
        gasLimit: 600_000,
      },
    );

    console.log("Response: ", tx);

    // const permit = await newPermit(
    //   wallet,
    //   wallet.address,
    //   "secretdev-1",
    //   "test permit",
    //   [env.CONTRACT_ADDRESS],
    //   ["owner"],
    //   false,
    // );
    //
    // const tokens_query = {
    //   with_permit: {
    //     permit,
    //     query: {
    //       tokens: {
    //         owner: walletAddress,
    //       },
    //     },
    //   },
    // };
    //
    // let tokens = await secretjs.query.compute.queryContract({
    //   contract_address: env.CONTRACT_ADDRESS,
    //   query: tokens_query,
    // });
    // // lists all the tokens owned
    // console.log(tokens);

    // query information about a specific token (token_id that we created above)
    // let nft_dossier_query = {
    //   with_permit: {
    //     permit,
    //     query: {
    //       nft_dossier: {
    //         token_id,
    //       },
    //     },
    //   },
    // };
    // let nft_dossier = await secretjs.query.compute.queryContract({
    //   contract_address,
    //   code_hash,
    //   query: nft_dossier_query,
    // });
    // get the info about your token
    // console.dir(nft_dossier, { depth: null });

    return NextResponse.json(
      {
        message: "NFT minted successfully!",
        transactionHash: tx.transactionHash,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error minting nft: ", error);
    return NextResponse.json({ error: "Failed to query contract" });
  }
}
