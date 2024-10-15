import { env } from "@/env";
import {
  newSignDoc,
  Permission,
  Permit,
  SecretNetworkClient,
  stringToCoins,
  Wallet,
} from "secretjs";
import { AminoSigner } from "secretjs/dist/wallet_amino";

const wallet = new Wallet(env.ADMIN_MNEMONIC);

export function getWallet() {
  return wallet;
}

export function getSecretJsClient() {
  const secretjs = new SecretNetworkClient({
    url: env.NEXT_PUBLIC_RPC_URL,
    chainId: env.NEXT_PUBLIC_CHAIN_ID,
    wallet: wallet,
    walletAddress: wallet.address,
  });
  return secretjs;
}

export const newPermit = async (
  signer: AminoSigner,
  owner: string,
  chainId: string,
  permitName: string,
  allowedTokens: string[],
  permissions: Permission[],
  keplr: boolean,
): Promise<Permit> => {
  let signature;
  if (!keplr) {
    // Check if the signer has "signPermit" function and use it instead
    signature =
      typeof signer.signPermit === "function"
        ? (
            await signer.signPermit(
              owner,
              newSignDoc(chainId, permitName, allowedTokens, permissions),
            )
          ).signature
        : (
            await signer.signAmino(
              owner,
              newSignDoc(chainId, permitName, allowedTokens, permissions),
            )
          ).signature;
  }
  //@ts-ignore
  else if (!window?.keplr) {
    throw new Error(
      "Cannot sign with Keplr - extension not enabled; enable Keplr or change signing mode",
    );
  } else {
    //@ts-ignore
    ({ signature } = await window.keplr.signAmino(
      chainId,
      owner,
      {
        chain_id: chainId,
        account_number: "0", // Must be 0
        sequence: "0", // Must be 0
        fee: {
          amount: stringToCoins("0uscrt"), // Must be 0 uscrt
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
    ));
  }

  return {
    params: {
      chain_id: chainId,
      permit_name: permitName,
      allowed_tokens: allowedTokens,
      permissions,
    },
    signature: signature,
  };
};
