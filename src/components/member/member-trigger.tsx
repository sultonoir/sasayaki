"use client";

import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDialogGroup } from "@/hooks/use-dialog-group";

export default function MemberTrigger() {
  const { setOpen, open } = useDialogGroup();
  const handleCopy = () => {
    setOpen();
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="disabled:opacity-100"
            onClick={handleCopy}
            aria-label="button toggle member layout"
          >
            <Users />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {!open ? "Show" : "Hide"} Member list
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
