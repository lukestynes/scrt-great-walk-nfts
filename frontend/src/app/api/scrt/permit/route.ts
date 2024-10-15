import { NextResponse } from "next/server";
import { SecretNetworkClient, Wallet, Permit } from "secretjs";
import { PermitSigner } from "secretjs/dist/extensions/access_control/permit/permit_signer";

// Function to set up Secret Network client
// };
// const getSecretClient = async () => {
// return secretjs;
//
const mnemonic =
  "grab slot view laundry cotton airport base seven divert mix advice drill"; // Retrieve the mnemonic

const testMnemonic =
  "remain material solution thank narrow hen shield crew assault naive buffalo palace language medal letter dumb match sun arctic small music heart anger wild";

const wallet = new Wallet(testMnemonic);

const secretjs = new SecretNetworkClient({
  url: "http://209.38.23.8:1317/",
  chainId: "secretdev-1",
  wallet: wallet,
  walletAddress: wallet.address,
});

const permitName = "my-permit";
const allowedContract = "<contract_address>"; // Contract you're allowing access to
const allowedQueries = ["tokens", "owner", "balance"]; // Queries you're allowing

const permit = new Permit({
  permitName,
  allowedContract,
  allowedQueries,
  walletAddress: wallet.address,
  chainId: "secretdev-1",
});

// const secretjs = new SecretNetworkClient({
//   chainId: "pulsar-3",
//   url: "https://api.pulsar3.scrttestnet.com",
//   wallet: wallet,
//   walletAddress: wallet.address,
// });
// Define the query to fetch walk data
export async function GET() {
  try {
    // const secretjs = await getSecretClient();

    // Send the query to the contract
    // const response = await secretjs.query.compute.queryContract({
    //   code_hash:
    //     "fe003025981b64f2a55f1e1fc2881fa6c11c0a1a571fd51a279607f2e397e4bb",
    //   query: {
    //     contract_info: {},
    //   },
    // });

    // Return the response as JSON

    // Query the walk data
    const permitName = "my-permit";
    const allowedContract = "<contract_address>"; // Contract you're allowing access to
    const allowedQueries = ["tokens", "owner", "balance"]; // Queries you're allowing

    const permit = await Permit.sign({
      permitName,
      allowedContract,
      allowedQueries,
      walletAddress: wallet.address,
      chainId: "secretdev-1",
    });

    const querytokens = await secretjs.query.compute.queryContract({
      contract_address: "secret1mlwthvh62emlh2kr6sxksfgevdjl7pmdcckhse",
      query: {
        tokens: {
          owner: "secret1dpuzh36zzpfrt5pdza837ffm8egkzq0ezukzqr",
          start_after: null,
          limit: 10,
        },
      },
    });

    return NextResponse.json(querytokens);
  } catch (error) {
    console.error("Error querying walk data:", error);
    return NextResponse.json({ error: "Failed to query contract" });
  }
}
