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

    try {
      // Enable Keplr and get wallet information
      if (!window.keplr) {
        alert("Please install the Keplr extension");
        return;
      }

      await window.keplr.enable(env.NEXT_PUBLIC_CHAIN_ID);
      const offlineSigner = window.getOfflineSigner(env.NEXT_PUBLIC_CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      const walletAddress = accounts[0].address;

      //
      // const permit = await newPermit(
      //   offlineSigner,
      //   walletAddress,
      //   env.NEXT_PUBLIC_CHAIN_ID,
      //   "test permit",
      //   [env.NEXT_PUBLIC_CONTRACT_ADDRESS],
      //   ["owner"],
      //   false,
      // );
      //
      const tokens_query = {
        nft_dossier: {
          // owner: walletAddress,
          token_id: "22",
        },
      };

      // Manually create the permit payload

      const secretjs = new SecretNetworkClient({
        url: env.NEXT_PUBLIC_RPC_URL,
        chainId: env.NEXT_PUBLIC_CHAIN_ID,
        wallet: offlineSigner,
        walletAddress: walletAddress,
      });

      const tokens = await secretjs.query.compute.queryContract({
        contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        query: tokens_query,
      });
      // lists all the tokens owned
      console.log("TOKENS", tokens);

      // // Send the permit and wallet address to the backend API
      // const response = await fetch("/api/query-tokens", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     permit,
      //     walletAddress,
      //     contractAddress: contract_address,
      //   }),
      // });
      //
      // const data = await response.json();
      // if (response.ok) {
      //   setTokens(data.tokens);
      // } else {
      //   setError(data.error);
      // }
    } catch (err) {
      setError("Error fetching tokens or interacting with Keplr");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
