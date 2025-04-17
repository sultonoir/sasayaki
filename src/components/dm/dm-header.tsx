"use client";
import React from "react";
import { UserAvatar } from "../user/user-avatar";
import { useDialogGroup } from "@/hooks/use-dialog-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import SearchDesktop from "../search/search-desktop";
import { SearchMobile } from "../search/search-mobile";

interface DmHeaderProps {
  name: string;
  image: string;
  blur: string;
  online: boolean;
}
const DmHeader = (props: DmHeaderProps) => {
  const { setOpen, open } = useDialogGroup();
  const { toggleSidebar, isMobile } = useSidebar();
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button size="icon" variant="ghost" onClick={toggleSidebar}>
            <ArrowLeft />
          </Button>
        )}
        <UserAvatar
          online={props.online}
          blur={props.blur}
          name={props.blur}
          src={props.image}
        />
        <p className="text-sm">{props.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <SearchDesktop />
        <SearchMobile />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="disabled:opacity-100"
              onClick={setOpen}
              aria-label="button toggle member layout"
            >
              <User />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="px-2 py-1 text-xs">
            {!open ? "Show" : "Hide"} user profile
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default DmHeader;
