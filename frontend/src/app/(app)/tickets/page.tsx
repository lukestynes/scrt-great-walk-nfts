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
const nftTicketsUpcoming = [
  { id: 3, name: "Kepler Track", startDate: "2024-01-10", status: "Upcoming" },
  {
    id: 4,
    name: "Abel Tasman Coast Track",
    startDate: "2023-10-20",
    status: "Upcoming",
  },
  {
    id: 5,
    name: "Tongariro Northern Circuit",
    startDate: "2024-02-05",
    status: "Upcoming",
  },
];

const nftTicketsComplete = [
  {
    id: 1,
    name: "Milford Track",
    startDate: "2023-12-01",
    status: "Completed",
  },
  {
    id: 2,
    name: "Routeburn Track",
    startDate: "2023-11-15",
    status: "Completed",
  },
];

export default function TicketsPage() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Your Tickets</h1>
      <Card>
        <CardHeader>
          <h2>Upcoming</h2>
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
              {nftTicketsUpcoming
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
                )
                .map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="hover:underline"
                      >
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
          <h2>Completed</h2>
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
              {nftTicketsComplete
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
    </div>
  );
}
