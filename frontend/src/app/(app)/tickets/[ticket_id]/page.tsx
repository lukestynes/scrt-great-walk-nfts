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
import { MapPin, Theater, Trophy } from "lucide-react";
import { format } from "date-fns";

// Placeholder data
const ticketData = {
  id: "GWTE-001",
  walkName: "Milford Track",
  startDate: "2023-11-15",
  duration: "4 days",
  progress: 60,
  checkpoints: [
    { id: 1, name: "Glade Wharf", completed: true },
    { id: 2, name: "Clinton Hut", completed: true },
    { id: 3, name: "Mintaro Hut", completed: true },
    { id: 4, name: "Dumpling Hut", completed: false },
    { id: 5, name: "Sandfly Point", completed: false },
  ],
  nextCheckpoint: {
    name: "Dumpling Hut",
    hint: "Look for the cascading waterfalls near the hut.",
  },
  nftStages: [
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ],
};

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
};

const defaultTicket: TicketData = {
  maxProgress: "0",
  progress: "0",
  walkName: "",
  walkDate: "",
};

export default function TicketDetailsPage({ params }: PageProps) {
  const [currentNftStage, setCurrentNftStage] = useState(0);
  const [nftData, setNftData] = useState<TicketData>();

  const { ticket_id } = params;

  useEffect(() => {
    const getTicketInfo = async () => {
      const response = await fetch(`/api/scrt/nftinfo?tokenId=${ticket_id}`);
      const ticketData = await response.json();

      if (!response.ok) {
        throw new Error(ticketData.error || "Failed to fetch NFT data");
      }

      console.log("DATA: ", ticketData);

      const attributes = ticketData.nft_info.extension.attributes;
      const walkName = attributes.find(
        (attr) => attr.trait_type === "Walk Name",
      )?.value;
      const walkDate = attributes.find(
        (attr) => attr.trait_type === "Walk Date",
      )?.value;
      const progress = attributes.find(
        (attr) => attr.trait_type === "Checkpoint Progress",
      )?.value;
      const maxProgress = attributes.find(
        (attr) => attr.trait_type === "Checkpoint Progress",
      )?.max_value;

      const image = ticketData.nft_info.extension.image;

      const theGoods: TicketData = {
        walkName,
        walkDate,
        progress,
        maxProgress,
        image,
      };

      setNftData(theGoods);

      console.log("NFT: ", nftData);
      console.log("THE GOODS: ", theGoods);
    };

    void getTicketInfo();
  }, [ticket_id]);

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">{ticketData.walkName} Ticket</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
            <CardDescription>Details about your adventure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">{nftData?.image}</p>
            </div>
            <p>
              <strong>Ticket ID:</strong> {ticket_id}
            </p>
            <p>
              <strong>Start Date:</strong>
              {nftData?.walkDate}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {parseInt(nftData?.maxProgress ?? 0) + 1}
            </p>
            <div className="mt-4">
              <div className="mb-2 flex justify-between">
                <span>Progress</span>
                <span>
                  {Math.floor(
                    (parseInt(nftData?.progress ?? "0", 10) /
                      parseInt(nftData?.maxProgress ?? "0", 10)) *
                      100,
                  )}
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

        <div className="flex h-full flex-col gap-4">
          <Card className="h-1/4">
            <CardHeader>
              <CardTitle>Next Checkpoint</CardTitle>
              <CardDescription>
                Hint for your upcoming destination
              </CardDescription>
            </CardHeader>
            <CardContent>checkpoint to go here</CardContent>
          </Card>
          <Card className="h-3/4">
            <CardHeader>
              <CardTitle>Checkpoints</CardTitle>
              <CardDescription>Your progress along the track</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {ticketData.checkpoints.map((checkpoint) => (
                  <li key={checkpoint.id} className="flex items-center">
                    <Badge
                      variant={checkpoint.completed ? "default" : "outline"}
                      className="mr-2"
                    >
                      {checkpoint.completed ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Badge>
                    <span
                      className={checkpoint.completed ? "line-through" : ""}
                    >
                      {checkpoint.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
