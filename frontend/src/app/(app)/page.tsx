import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Trophy,
  Ticket,
  BarChart,
  Camera,
  Mountain,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <div className="container relative z-10 mx-auto px-4 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold">
              Great Walk NFT Experience
            </h1>
            <p className="mb-8 text-xl">
              Embark on New Zealand&apos;s iconic Great Walks and collect
              evolving NFTs as you progress. Turn your hiking adventure into a
              digital memory!
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-500 hover:bg-blue-100"
            >
              Purchase Your Ticket
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="New Zealand Great Walk landscape"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20" id="about">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Ticket,
                title: "Purchase Ticket",
                description:
                  "Buy your Great Walk ticket and receive a unique, evolving NFT.",
              },
              {
                icon: MapPin,
                title: "Check-in",
                description:
                  "Use your mobile device to check in at huts or landmarks along your hike.",
              },
              {
                icon: BarChart,
                title: "Watch It Evolve",
                description:
                  "See your NFT transform as you progress through your Great Walk journey.",
              },
              {
                icon: Trophy,
                title: "Complete Your Collection",
                description:
                  "Finish your hike and receive a fully evolved NFT as proof of your adventure.",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="mb-4 h-10 w-10 text-blue-500" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Experience Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            A Unique Hiking Experience
          </h2>
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-lg">
              The Great Walk NFT Experience combines the breathtaking beauty of
              New Zealand&apos;s iconic trails with cutting-edge digital
              collectibles. As you journey through some of the world&apos;s most
              stunning landscapes, your NFT evolves, creating a dynamic digital
              record of your adventure.
            </p>
            <p className="mb-6 text-lg">
              This isn&apos;t just a hike—it&apos;s a new way to commemorate
              your achievements and share your experiences. Each check-in point
              along your Great Walk becomes a milestone in your NFT&apos;s
              evolution, reflecting the progress of your journey in real-time.
            </p>
            <p className="text-lg">
              Whether you&apos;re conquering the Milford Track, exploring the
              Routeburn, or discovering the wonders of Abel Tasman, your Great
              Walk NFT will be a unique, personalized memento of your New
              Zealand adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Who It&apos;s For
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Mountain,
                title: "Hiking Enthusiasts",
                description:
                  "Adventurers looking to experience New Zealand's Great Walks with a digital twist.",
              },
              {
                icon: Camera,
                title: "Memory Collectors",
                description:
                  "Travelers who want a unique, evolving digital souvenir of their journey.",
              },
              {
                icon: Trophy,
                title: "Achievement Hunters",
                description:
                  "Hikers who love to track and showcase their outdoor accomplishments.",
              },
            ].map((audience, index) => (
              <Card key={index}>
                <CardHeader>
                  <audience.icon className="mb-4 h-10 w-10 text-green-500" />
                  <CardTitle>{audience.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{audience.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available Great Walks Section */}
      <section className="bg-white py-20" id="walks">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Available Great Walks
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Available */}
            {["Routeburn Track"].map((walk, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{walk}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            ))}
            {/* Unavailable */}
            {[
              "Milford Track",
              "Kepler Track",
              "Abel Tasman Coast Track",
              "Tongariro Northern Circuit",
              "Lake Waikaremoana Great Walk",
            ].map((walk, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{walk}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon!
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-500 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Start Your Great Walk Adventure?
          </h2>
          <p className="mb-8 text-xl">
            Purchase your ticket now and begin your journey with a unique,
            evolving NFT!
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-white bg-transparent text-white hover:bg-white hover:text-blue-500"
          >
            Purchase Your Ticket
          </Button>
        </div>
      </section>
    </div>
  );
}
