"use client";

import Link from "next/link";
import { CircleUser, Menu, MountainSnowIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-toggle";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const navItemsAuth = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Purchase",
    href: "/purchase",
  },
  {
    name: "Tickets",
    href: "/tickets",
  },
];

const navItemsNoAuth = [
  {
    name: "About",
    href: "#about",
  },
  {
    name: "Walks",
    href: "#walks",
  },
];

export default function NavInner({ isAuth }: { isAuth: boolean }) {
  const [authorised, setAuthorised] = React.useState(isAuth);
  const pathname = usePathname();
  const router = useRouter();

  const isLandingPage = pathname === "/";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
      });

      if (response.ok) {
        console.log("Logged out successfully");
        setAuthorised(false);
        router.push("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="sticky top-0 flex h-16 w-full items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <MountainSnowIcon />
        </Link>
        {isLandingPage
          ? navItemsNoAuth.map((item) => (
              <Link
                key={item.name}
                href={item.href ?? ""}
                className={`hover:text-forground text-muted-foreground transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                } `}
              >
                {item.name}
              </Link>
            ))
          : navItemsAuth.map((item) => (
              <Link
                key={item.name}
                href={item.href ?? ""}
                className={`hover:text-forground text-muted-foreground transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                } `}
              >
                {item.name}
              </Link>
            ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <MountainSnowIcon className="h-6 w-6" />
            </Link>
            {isLandingPage
              ? navItemsNoAuth.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href ?? ""}
                    className={`hover:text-forground text-muted-foreground transition-colors ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    } `}
                  >
                    {item.name}
                  </Link>
                ))
              : navItemsAuth.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href ?? ""}
                    className={`hover:text-forground text-muted-foreground transition-colors ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    } `}
                  >
                    {item.name}
                  </Link>
                ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ModeToggle />
        {authorised ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={"/login"}>
            <Button>Log In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
