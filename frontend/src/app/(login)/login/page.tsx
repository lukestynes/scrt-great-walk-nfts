"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const [processing, setProcessing] = React.useState(false);
  const router = useRouter();

  const connectKeplr = async () => {
    try {
      setProcessing(true);
      if (!window.keplr) {
        alert("Please install the Keplr extension");
        return;
      }

      // Enable Keplr for the Secret Network
      await window.keplr.enable("secret-4"); // Replace with your chain ID

      const offlineSigner = window.keplr.getOfflineSigner("secret-4");
      const accounts = await offlineSigner.getAccounts();

      console.log("WALLET: ", offlineSigner);

      const address = accounts[0]?.address;
      console.log("ADDRESS: ", address);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!response.ok) {
        console.error("Failed to set cookie");
        setProcessing(false);
      }

      // Store the wallet address in a cookie to persist the session
      document.cookie = `walletAddress=${address}; path=/ max-age=86400;`;

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (error) {
      console.error("Error connecting Keplr wallet:", error);
      setProcessing(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold sm:text-4xl md:text-5xl">
            Great Walks NFT Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-8 text-center text-muted-foreground">
            Embark on New Zealand&apos;s iconic Great Walks and collect evolving
            NFTs as you progress. Connect your Keplr wallet to start your
            adventure and track your journey in real time!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-lg text-white hover:bg-gradient-to-l hover:from-blue-400 hover:to-purple-400"
            onClick={connectKeplr}
            disabled={processing}
          >
            {processing && <Loader2 className="mr-5 h-5 w-5 animate-spin" />}
            <Image
              src="/keplr-logo.svg"
              width={15}
              height={15}
              alt="K"
              className="mr-5"
            />
            Login with Keplr Wallet
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
