"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Cloud, Sun, Droplets, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { env } from "@/env";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Placeholder weather data
const weatherData = {
  temperature: 18,
  condition: "Partly Cloudy",
  precipitation: 20,
};

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nftTickets, setNftTickets] = useState([]); // To store NFT ticket data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/scrt/ticketsinfo`);
        let data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch NFTs");
        }
        console.log("DATA: ", data);
        if (!data) {
          data = [];
        }
        const tickets = data.map((ticketData) => {
          const attributes = ticketData.nft_info.nft_info.extension.attributes;
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

          const image = ticketData.nft_info.nft_info.extension.image;

          return {
            walkName,
            walkDate,
            progress,
            maxProgress,
            token_id: ticketData.token_id,
            image,
          };
        });

        setNftTickets(tickets);

        console.log(data);
        console.log(tickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    void fetchNFTs();
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Date and Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{format(currentDate, "MMMM d, yyyy")}</p>
            <p className="text-xl">{format(currentDate, "HH:mm:ss")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>Mock weather</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            {weatherData.condition === "Sunny" && <Sun className="h-10 w-10" />}
            {weatherData.condition === "Partly Cloudy" && (
              <Cloud className="h-10 w-10" />
            )}
            <div>
              <p className="text-2xl">{weatherData.temperature}°C</p>
              <p>{weatherData.condition}</p>
              <p className="flex items-center">
                <Droplets className="mr-1 h-4 w-4" />
                {weatherData.precipitation}% precipitation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Walks Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex w-full justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>Loading</p>
            </div>
          ) : error ? (
            <p>Error: {error}</p>
          ) : nftTickets && nftTickets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Walk Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nftTickets
                  .sort(
                    (a, b) =>
                      new Date(a.walkDate).getTime() -
                      new Date(b.walkDate).getTime(),
                  )
                  .map((ticket, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          href={`/tickets/${ticket.token_id}`}
                          className="hover:underline"
                        >
                          {ticket.walkName}
                        </Link>
                      </TableCell>
                      <TableCell>{ticket.walkDate}</TableCell>
                      <TableCell>
                        <Progress
                          value={Math.floor(
                            (ticket.progress / ticket.maxProgress) * 100,
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex w-full justify-center">
              <div className="flex flex-col justify-center">
                <p className="pb-2 text-center">No tickets found.</p>
                <Link href="/purchase">
                  <Button className="w-full">Get Tickets</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Completed Walks NFT&apos;s</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex w-full justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>Loading</p>
            </div>
          ) : (
            <div className="flex justify-center gap-5 overflow-x-auto">
              {nftTickets?.some(
                (ticket) => ticket.progress >= ticket.maxProgress,
              ) ? (
                nftTickets
                  .filter((ticket) => ticket.progress >= ticket.maxProgress) // Only completed walks
                  .map((ticket, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center rounded-lg bg-muted p-3"
                    >
                      <Image
                        src={ticket.image} // Assuming `ticket.image` contains the URL for the NFT image
                        alt={ticket.name}
                        width={150}
                        height={150}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  ))
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">
                    Complete a walk first!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
