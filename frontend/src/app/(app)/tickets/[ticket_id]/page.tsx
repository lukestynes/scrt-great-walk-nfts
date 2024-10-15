"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Theater, Trophy } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { env } from "@/env";
import { SecretNetworkClient, TxResultCode } from "secretjs";
import CheckpointsDisplay from "@/components/checkpoint-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NftDossier } from "@/types/nft-dossier";

// Placeholder data

interface PageProps {
  params: {
    ticket_id: string;
  };
}

type TicketData = {
  maxProgress: string;
  progress: string;
  walkDate: string;
  walkName: string;
  image: string;
  hint: string;
  nextCheckpoint: string;
  completed: string;
  pageName: string;
};

const defaultTicket: TicketData = {
  pageName: "",
  maxProgress: "0",
  progress: "0",
  walkName: "",
  walkDate: "",
  hint: "",
  nextCheckpoint: "",
  image: "",
  completed: "",
};

export default function TicketDetailsPage({ params }: PageProps) {
  const [nftData, setNftData] = useState<TicketData>(defaultTicket);
  const [processing, setProcessing] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  const { ticket_id } = params;

  useEffect(() => {
    const getDossier = async () => {
      if (!window.keplr) {
        toast.error("You need to install the Keplr extension!", {
          description: (
            <Link href="https://www.keplr.app/">https://www.keplr.app/</Link>
          ),
        });
        setProcessing(false);
        return;
      }

      await window.keplr.enable(env.NEXT_PUBLIC_CHAIN_ID);
      const offlineSigner = window.getOfflineSigner(env.NEXT_PUBLIC_CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      const walletAddress = accounts[0].address;

      const permitName = "detail permit"; // Set the permit name
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

      const secretjs = new SecretNetworkClient({
        url: env.NEXT_PUBLIC_RPC_URL,
        chainId: env.NEXT_PUBLIC_CHAIN_ID,
        wallet: offlineSigner,
        walletAddress: walletAddress,
      });

      const response = await secretjs.query.compute.queryContract({
        contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS, // The contract address where your NFT resides
        code_hash: env.NEXT_PUBLIC_CODE_HASH, // The code hash of the contract
        query: {
          with_permit: {
            query: {
              nft_dossier: {
                token_id: ticket_id, // Query the nft_dossier by token ID
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

      const nft_dossier_response: NftDossier = response as NftDossier;
      const nft_dossier = nft_dossier_response.nft_dossier;

      // Log the NFT dossier data
      console.log(nft_dossier);

      // Extract data from public and private metadata
      const publicAttributes = nft_dossier.public_metadata.extension.attributes;
      const privateAttributes =
        nft_dossier.private_metadata?.extension.attributes;

      // Extract necessary fields from public metadata
      const walkName = publicAttributes.find(
        (attr) => attr.trait_type === "Walk Name",
      )?.value;
      const walkDate = publicAttributes.find(
        (attr) => attr.trait_type === "Walk Date",
      )?.value;
      const progress = publicAttributes.find(
        (attr) => attr.trait_type === "Checkpoint Progress",
      )?.value;
      const maxProgress = publicAttributes.find(
        (attr) => attr.trait_type === "Checkpoint Progress",
      )?.max_value;
      const image = nft_dossier.public_metadata.extension.image;
      const pageName = nft_dossier.public_metadata.extension.name;

      // You can also extract private metadata if necessary
      const hint = privateAttributes?.find(
        (attr) => attr.trait_type === "Next Hint",
      )?.value;
      const nextCheckpoint = privateAttributes?.find(
        (attr) => attr.trait_type === "Next Checkpoint",
      )?.value;
      const completed = privateAttributes?.find(
        (attr) => attr.trait_type === "Completed Checkpoints",
      )?.value;

      const theGoods: TicketData = {
        walkName,
        walkDate,
        progress,
        maxProgress,
        image,
        nextCheckpoint,
        hint,
        completed,
        pageName,
      };

      setNftData(theGoods);

      console.log("NFT: ", nftData);
      console.log("THE GOODS: ", theGoods);
    };

    void getDossier();
  }, [forceRefresh]);

  const handleAdvance = async () => {
    setProcessing(true);

    if (!window.keplr) {
      toast.error("You need to install the Keplr extension!", {
        description: (
          <Link href="https://www.keplr.app/">https://www.keplr.app/</Link>
        ),
      });
      setProcessing(false);
      return;
    }
    await window.keplr.enable(env.NEXT_PUBLIC_CHAIN_ID);
    const offlineSigner = window.getOfflineSigner(env.NEXT_PUBLIC_CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    const walletAddress = accounts[0].address;

    // Initialize the SecretJS client
    const secretjs = new SecretNetworkClient({
      url: env.NEXT_PUBLIC_RPC_URL,
      chainId: env.NEXT_PUBLIC_CHAIN_ID,
      wallet: offlineSigner,
      walletAddress: walletAddress,
    });

    // Prepare the message to send the "AdvanceToken" execute message
    const executeMsg = {
      advance_token: {
        token_id: ticket_id, // Token ID to advance
      },
    };

    // Execute the contract message
    const tx = await secretjs.tx.compute.executeContract(
      {
        sender: walletAddress,
        contract_address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        code_hash: env.NEXT_PUBLIC_CODE_HASH, // Code hash of your contract
        msg: executeMsg,
        sent_funds: [], // No funds need to be sent
      },
      {
        gasLimit: 600_000, // Set appropriate gas limit
      },
    );

    // Check for success
    if (tx.code !== TxResultCode.Success) {
      toast.error("Failed to advance token.", {
        description: `Error: ${tx.rawLog}`,
      });
      setProcessing(false);
    }

    console.log("Success! Token advanced:", tx.transactionHash);
    toast.info("Token advanced successfully!", {
      icon: "🚀",
      description: "You have advanced to the next checkpoint! 🎉",
    });
    setProcessing(false);
    setForceRefresh(!forceRefresh);
    return tx.transactionHash; // Return the transaction hash on success
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">{nftData.pageName}</h1>
      {nftData.progress === nftData.maxProgress && (
        <Alert>
          <AlertTitle>Congratulations!</AlertTitle>
          <AlertDescription>You have completed the walk! 🎉</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
            <CardDescription>Details about your adventure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <Image
                src={nftData?.image}
                width="450"
                height="450"
                alt="Badge"
              />
            </div>
            <p>
              <strong>Ticket ID:</strong> {ticket_id}
            </p>
            <p>
              <strong>Start Date: </strong>
              {nftData?.walkDate}
            </p>
            <p>
              <strong>Duration:</strong> {parseInt(nftData?.maxProgress ?? "0")}
            </p>
            <div className="mt-4">
              <div className="mb-2 flex justify-between">
                <span>Progress</span>
                <span>
                  {Math.floor(
                    (parseInt(nftData?.progress ?? "0", 10) /
                      parseInt(nftData?.maxProgress ?? "0", 10)) *
                      100,
                  )}{" "}
                  %
                </span>
              </div>
              <Progress
                value={Math.floor(
                  (parseInt(nftData?.progress ?? "0", 10) /
                    parseInt(nftData?.maxProgress ?? "0", 10)) *
                    100,
                )}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex h-full flex-col gap-6">
          <Card className="h-1/3">
            <CardHeader>
              <CardTitle>Next Checkpoint</CardTitle>
              <CardDescription>
                Hint for your upcoming destination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Hint: </strong>
                {nftData?.hint}
                <div className="mt-10 w-full">
                  {nftData.progress < nftData.maxProgress && (
                    <Button
                      className="mx-auto w-full"
                      onClick={handleAdvance}
                      disabled={processing}
                    >
                      {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Check In
                    </Button>
                  )}
                </div>
              </p>
            </CardContent>
          </Card>
          <Card className="h-2/3">
            <CardHeader>
              <CardTitle>Checkpoints</CardTitle>
              <CardDescription>Your progress along the track</CardDescription>
            </CardHeader>
            <CardContent>
              <CheckpointsDisplay
                maxProgress={parseInt(nftData?.maxProgress, 10)}
                currentCheckpoints={nftData?.completed}
                nextCheckpoint={nftData?.nextCheckpoint}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
