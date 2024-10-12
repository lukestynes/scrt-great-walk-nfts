"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const greatWalks = [
  { id: "routeburn", name: "Routeburn Track" },
  { id: "milford", name: "Milford Track" },
  { id: "kepler", name: "Kepler Track" },
  { id: "abel-tasman", name: "Abel Tasman Coast Track" },
  { id: "tongariro", name: "Tongariro Northern Circuit" },
];

type Ticket = {
  id: string;
  walkName: string;
  startDate: Date;
  price: number;
  duration: number;
};

const defaultTicket = {
  id: "",
  walkName: "",
  startDate: new Date(),
  price: 0,
  duration: 0,
};

export default function PurchaseTicketPage() {
  const [selectedWalk, setSelectedWalk] = useState("");
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState<Ticket>(defaultTicket);
  const [notAvailable, setNotAvailable] = useState(false);

  const handleSearch = () => {
    if (!selectedWalk || !date) return;

    setIsLoading(true);
    setNotAvailable(false);
    setTicket(defaultTicket);

    if (selectedWalk !== "routeburn") {
      setTimeout(() => {
        setNotAvailable(true);
        setIsLoading(false);
      }, 1500);
    } else {
      // Simulate API call
      setTimeout(() => {
        setTicket({
          id: Math.random().toString(36).substr(2, 9),
          walkName:
            greatWalks.find((walk) => walk.id === selectedWalk)?.name ?? "",
          startDate: date,
          price: Math.floor(Math.random() * (300 - 100 + 1) + 100),
          duration: Math.floor(Math.random() * (7 - 3 + 1) + 3),
        });
        setNotAvailable(false);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Purchase a Ticket</h1>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <Select onValueChange={setSelectedWalk}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Great Walk" />
          </SelectTrigger>
          <SelectContent>
            {greatWalks.map((walk) => (
              <SelectItem key={walk.id} value={walk.id}>
                {walk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        onClick={handleSearch}
        disabled={!selectedWalk || !date || isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          "Search for Tickets"
        )}
      </Button>

      {ticket.id !== "" && (
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>{ticket.walkName} Ticket</CardTitle>
            <CardDescription>Your adventure awaits!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Ticket ID:</strong> {ticket.id}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {format(ticket.startDate, "MMMM d, yyyy")}
            </p>
            <p>
              <strong>Duration:</strong> {ticket.duration} days
            </p>
            <p>
              <strong>Price:</strong> ${ticket.price}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Purchase Ticket</Button>
          </CardFooter>
        </Card>
      )}
      {notAvailable && (
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>No tickets available for this date.</CardTitle>
            <CardDescription>Please try another date or tour</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" disabled>
              Unavailable
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
