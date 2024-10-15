import { Trophy, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export default function CheckpointsDisplay({
  maxProgress,
  currentCheckpoints,
  nextCheckpoint,
}: {
  maxProgress: number;
  currentCheckpoints: string; // string with comma-separated checkpoints that have been completed
  nextCheckpoint: string;
}) {
  // Split the completed checkpoints into an array
  const completedCheckpoints = currentCheckpoints
    ? currentCheckpoints.split(",")
    : [];

  return (
    <ul className="space-y-2">
      {Array.from({ length: maxProgress }).map((_, index) => {
        const isCompleted = completedCheckpoints[index] !== undefined;
        const isNextCheckpoint =
          completedCheckpoints.length === 0
            ? index === 0 // If no checkpoints are completed, the first one is the next
            : !isCompleted && index === completedCheckpoints.length;

        let displayText;
        let badgeIcon;

        if (isCompleted) {
          displayText = completedCheckpoints[index];
          badgeIcon = <Trophy className="h-4 w-4" />;
        } else if (isNextCheckpoint) {
          displayText = nextCheckpoint;
          badgeIcon = <MapPin className="h-4 w-4" />;
        } else {
          displayText = "Checkpoint Hidden";
          badgeIcon = <QuestionMarkCircledIcon className="h-4 w-4" />;
        }

        return (
          <li
            key={index}
            className={`flex items-center ${
              !isCompleted && !isNextCheckpoint ? "opacity-50 blur-sm" : ""
            }`}
          >
            <Badge
              variant={isCompleted ? "default" : "outline"}
              className="mr-2"
            >
              {badgeIcon}
            </Badge>
            <span className={isCompleted ? "line-through" : ""}>
              {displayText}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
