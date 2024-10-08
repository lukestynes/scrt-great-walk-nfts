import { fromUtf8, MsgExecuteContractResponse, newPermit, SecretNetworkClient, Wallet } from "secretjs";
import * as dotenv from "dotenv";
import * as crypto from "node:crypto";

dotenv.config();  // Load environment variables from .env file 
const mnemonic = process.env.MNEMONIC;  // Retrieve the mnemonic

const wallet = new Wallet(mnemonic);

// create a new client for the Pulsar testnet
const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

export const main = async (): Promise<void> => {
    if (process.argv.length !== 4) {
        console.error('Expected two arguments!');
        process.exit(1);
    }

    let contract_address = process.argv[2];
    let code_hash = process.argv[3];

    // this is sending a message to mint the NFT
    let create_msg = {
        mint_nft: {
            public_metadata: {
                description: "put a public description here",
                name: "a public name",
                attributes: [
                    {
                        trait_type: "public attribute 1",
                        value: "public attr 1 value",
                    }
                ],
                token_subtype: "badge",
            },
            private_metadata: {
                description: "put a private description here",
                name: "a secret name",
                attributes: [
                    {
                        trait_type: "private attribute 1",
                        value: "private attr 1 value",
                    }
                ],
            },
        }
    };
    let tx = await secretjs.tx.compute.executeContract(
        {
            sender: wallet.address,
            contract_address,
            code_hash, 
            msg: create_msg,
            sent_funds: [],
        },
        {
            gasLimit: 400_000,
        }
    );
    let response = JSON.parse(fromUtf8(MsgExecuteContractResponse.decode(tx.data[0]).data));
    let token_id = response.mint_nft.token_id;

    // query the tokens owned by a given address

    // first we need to create a query permit for authentication
    let permit = await newPermit(wallet, wallet.address, "pulsar-3", "test permit", [contract_address], ["owner"], false);
    
    let tokens_query = {
        with_permit: {
            permit,
            query: {
                tokens: {
                    owner: wallet.address,
                }
            }
        }
    };
    let tokens = await secretjs.query.compute.queryContract({
        contract_address,
        code_hash,
        query: tokens_query,
    });
    // lists all the tokens owned
    console.log(tokens);

    // query information about a specific token (token_id that we created above)
    let nft_dossier_query = {
        with_permit: {
            permit,
            query: {
                nft_dossier: {
                    token_id
                }
            }
        }
    }
    let nft_dossier = await secretjs.query.compute.queryContract({
        contract_address,
        code_hash,
        query: nft_dossier_query,
    });
    // get the info about your token
    console.dir(nft_dossier, {depth: null});

}

main()