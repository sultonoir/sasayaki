"use client";
import React from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import FriendIcon from "../ui/friend-icon";

const SidebarDm = React.memo(() => {
  return (
    <>
      <div className="flex w-full flex-col gap-2 border-b p-2">
        <Button size="sm" variant="accent">
          Find or start conversations
        </Button>
      </div>
      <div className="flex w-full flex-col gap-2 border-b p-2">
        <Button
          className="justify-start"
          variant="ghost"
          size="sm"
          startContent={<FriendIcon />}
        >
          Friends
        </Button>
      </div>
      <div className="group flex items-center justify-between p-2">
        <p className="group-hover:text-primary-foreground text-muted-foreground text-xs">
          Direct Messages
        </p>
        <PlusIcon className="group-hover:text-primary-foreground text-muted-foreground size-3 text-xs" />
      </div>
      <div className="flex grow flex-col overflow-y-auto p-2">
        <div className="min-h-screen">2</div>
      </div>
    </>
  );
});

SidebarDm.displayName = "SidebarDm";

export default SidebarDm;
