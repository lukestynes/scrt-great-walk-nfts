"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Cloud, Sun, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

// Placeholder data for NFT tickets
const nftTickets = [
  { id: 1, name: "Milford Track", startDate: "2024-12-01", status: "Upcoming" },
  { id: 3, name: "Kepler Track", startDate: "2025-01-10", status: "Upcoming" },
  {
    id: 5,
    name: "Tongariro Northern Circuit",
    startDate: "2025-02-05",
    status: "Upcoming",
  },
];

// Placeholder weather data
const weatherData = {
  temperature: 18,
  condition: "Partly Cloudy",
  precipitation: 20,
};

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
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
          <CardTitle>Your Upcoming Walks</CardTitle>
        </CardHeader>
        <CardContent>
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
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
                )
                .map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Link href="" className="hover:underline">
                        {ticket.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(ticket.startDate), "MMMM d, yyyy")}
                    </TableCell>
                    <TableCell>{ticket.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Completed Walks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-5">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">NFT Badge Display Here</p>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">NFT Badge Display Here</p>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">NFT Badge Display Here</p>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">NFT Badge Display Here</p>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">NFT Badge Display Here</p>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">NFT Badge Display Here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
