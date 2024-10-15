import Link from "next/link";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LinkIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="justify-left container mx-auto flex items-center px-4 py-4">
        <p className="text-sm text-muted-foreground">
          This was made by
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@lukestynes</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="/me.png" />
                  <AvatarFallback>LS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <h4 className="text-sm font-semibold">@lukestynes</h4>
                  <p className="text-sm">
                    4th Year Software Engineering student at UC
                  </p>
                  <Link
                    href="https://github.com/lukestynes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-muted-foreground hover:underline"
                  >
                    Github
                    <GitHubLogoIcon className="ml-1 h-4 w-4" />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/lukestynes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-muted-foreground hover:underline"
                  >
                    LinkedIn
                    <LinkedInLogoIcon className="ml-1 h-4 w-4" />
                  </Link>
                  <Link
                    href="https://lukestynes.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-muted-foreground hover:underline"
                  >
                    Website
                    <LinkIcon className="ml-1 h-4 w-4" />
                  </Link>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Created October 2024
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </p>
      </div>
    </footer>
  );
}
