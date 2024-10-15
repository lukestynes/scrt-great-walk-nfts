import { SecretNetworkClient, Wallet } from "secretjs";
import * as dotenv from "dotenv";
import * as crypto from "node:crypto";

dotenv.config(); // Load environment variables from .env file
const mnemonic = process.env.MNEMONIC; // Retrieve the mnemonic

const wallet = new Wallet(mnemonic);

// create a new client for the Pulsar testnet
const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

const instantiateContract = async (
  codeId: string,
  contractCodeHash: string
): Promise<string> => {
  // const initMsg = {
  //     name: "Critter NFT",
  //     symbol: "CRITTER",
  //     entropy: crypto.randomBytes(20).toString('hex'),
  //     config: {
  //         public_token_supply: true,
  //     },
  // };

  const initMsg = {
    name: "Great Walk NFT",
    symbol: "GWNFT",
    walk_name: "Routeburn Track",
    max_tickets: 50,
    checkpoint_coords: [
      "44.8221, 168.1136",
      "44.7322, 168.1590",
      "44.6593, 168.1694",
    ],
    checkpoint_names: ["Routeburn Shelter", "Falls Hut", "Lake Mackenzie"],
    checkpoint_hints: [
      "Start at Routeburn Shelter, a great place to begin your adventure.",
      "Head towards the beautiful Falls Hut, nestled in the forest.",
      "Make your way to Lake Mackenzie for a stunning view of the alpine lake.",
    ],
    badge_images: [
      "routeburn_shelter_badge.svg",
      "falls_hut_badge.svg",
      "lake_mackenzie_badge.svg",
    ],
    entropy: "f8e1b2c1938d1c46b4f7079874",
    config: {
      public_token_supply: true,
    },
  };
  // const initMsg = {
  //     admin: wallet.address
  // };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "test contract" + Math.ceil(Math.random() * 10000000),
    },
    {
      gasLimit: 400_000,
    }
  );

  //Find the contract_address in the logs
  //@ts-ignore
  const contractAddress = tx.arrayLog!.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  return contractAddress;
};

export const main = async (): Promise<void> => {
  if (process.argv.length !== 4) {
    console.error("Expected two arguments!");
    process.exit(1);
  }

  let code_id = process.argv[2];
  let code_hash = process.argv[3];

  const contract_address = await instantiateContract(code_id, code_hash);

  console.log("Contract address: ", contract_address);
};

main();
