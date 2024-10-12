"use client";

import { useState } from "react";
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
import { MapPin, Trophy } from "lucide-react";
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

export default function TicketDetailsPage() {
  const [currentNftStage, setCurrentNftStage] = useState(
    Math.floor(ticketData.progress / 20),
  );

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
              <p className="text-muted-foreground">
                Evolving NFT will be displayed here
              </p>
            </div>
            <p>
              <strong>Ticket ID:</strong> {ticketData.id}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {format(ticketData.startDate, "MMMM d, yyyy")}
            </p>
            <p>
              <strong>Duration:</strong> {ticketData.duration}
            </p>
            <div className="mt-4">
              <div className="mb-2 flex justify-between">
                <span>Progress</span>
                <span>{ticketData.progress}%</span>
              </div>
              <Progress value={ticketData.progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dynamic Map</CardTitle>
            <CardDescription>Track your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">
                Map will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                  <span className={checkpoint.completed ? "line-through" : ""}>
                    {checkpoint.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Checkpoint</CardTitle>
            <CardDescription>
              Hint for your upcoming destination
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
}
