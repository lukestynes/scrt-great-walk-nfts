// import { env } from "@/env";
// import { SecretNetworkClient } from "secretjs";
//
// export default async function TestPage() {
//   if (!window.keplr) {
//     alert("Please install the Keplr extension");
//     return;
//   }
//
//   // Enable Keplr for the Secret Network
//   await window.keplr.enable("secret-4"); // Replace with your chain ID
//
//   const offlineSigner = window.keplr.getOfflineSigner("secret-4");
//   const accounts = await offlineSigner.getAccounts();
//
//   console.log("WALLET: ", offlineSigner);
//
//   const address = accounts[0]?.address;
//   console.log("ADDRESS: ", address);
//
//   const secretjs = new SecretNetworkClient({
//     url: env.NEXT_PUBLIC_RPC_URL,
//     chainId: env.NEXT_PUBLIC_CHAIN_ID,
//     wallet: offlineSigner,
//     walletAddress: address,
//   });
//
//   const query = await secretjs.query.compute.queryContract({
//     contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
//     query: { nft_dossier: { token_id: "22" } },
//   });
//
//   console.log("QUERY", query);
//
//   return (
//     <div>
//       <h1>NFT INFO</h1>
//     </div>
//   );
// }

"use client";

import { env } from "@/env";
import { useState } from "react";
import { newPermit, SecretNetworkClient } from "secretjs";

export default function MintPermitComponent() {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle the permit creation and token query
  const fetchTokensWithPermit = async () => {
    setLoading(true);
    setError(null);
    setTokens(null);

    // Enable Keplr and get wallet information
    if (!window.keplr) {
      alert("Please install the Keplr extension");
      return;
    }

    await window.keplr.enable(env.NEXT_PUBLIC_CHAIN_ID);
    const offlineSigner = window.getOfflineSigner(env.NEXT_PUBLIC_CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    const walletAddress = accounts[0].address;

    const permitName = "test permit"; // Set the permit name
    const allowedTokens = [env.NEXT_PUBLIC_CONTRACT_ADDRESS]; // Set the allowed tokens or contract addresses
    const permissions = ["owner"]; // Set the permissions (e.g., "owner" for NFTs)

    const { signature } = await window.keplr.signAmino(
      env.NEXT_PUBLIC_CHAIN_ID,
      walletAddress,
      {
        chain_id: env.NEXT_PUBLIC_CHAIN_ID,
        account_number: "0", // Must be 0
        sequence: "0", // Must be 0
        fee: {
          amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
          gas: "1", // Must be 1
        },
        msgs: [
          {
            type: "query_permit", // Must be "query_permit"
            value: {
              permit_name: permitName,
              allowed_tokens: allowedTokens,
              permissions: permissions,
            },
          },
        ],
        memo: "", // Must be empty
      },
      {
        preferNoSetFee: true, // Fee must be 0, so hide it from the user
        preferNoSetMemo: true, // Memo must be empty, so hide it from the user
      },
    );

    const tokenId = "22"; // Replace with the actual token ID

    const secretjs = new SecretNetworkClient({
      url: env.NEXT_PUBLIC_RPC_URL,
      chainId: env.NEXT_PUBLIC_CHAIN_ID,
      wallet: offlineSigner,
      walletAddress: walletAddress,
    });

    const { nft_dossier } = await secretjs.query.compute.queryContract({
      contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS, // The contract address where your NFT resides
      code_hash: env.NEXT_PUBLIC_CODE_HASH, // The code hash of the contract
      query: {
        with_permit: {
          query: {
            nft_dossier: {
              token_id: tokenId, // Query the nft_dossier by token ID
            },
          },
          permit: {
            params: {
              permit_name: permitName,
              allowed_tokens: allowedTokens,
              chain_id: env.NEXT_PUBLIC_CHAIN_ID,
              permissions: permissions,
            },
            signature: signature, // Pass the signature from the permit
          },
        },
      },
    });

    // Log the NFT dossier data
    console.log(nft_dossier);
  };

  return (
    <div>
      <h1>Query Tokens with Permit</h1>
      <button onClick={fetchTokensWithPermit} disabled={loading}>
        {loading ? "Loading..." : "Query Tokens"}
      </button>

      {tokens && <pre>{JSON.stringify(tokens, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
