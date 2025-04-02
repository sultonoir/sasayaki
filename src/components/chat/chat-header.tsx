"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Image } from "@unpic/react/nextjs";
import { fromNow } from "@/lib/from-now";
import { Member } from "@/types";
import CopyLink from "../ui/copy-link";
import MemberTrigger from "../member/member-trigger";

interface Props {
  name: string;
  image: string;
  online: boolean;
  isGroup: boolean;
  lastSeen: number;
  code: string;
  members: Member[];
}

const ChatHeader = ({
  name,
  image,
  lastSeen,
  isGroup,
  online,
  members,
  code,
}: Props) => {
  const memberonline = members.map((member) => member.online === true);
  return (
    <header className="bg-card sticky top-0 z-50 flex shrink-0 items-center gap-2 rounded-t-lg border-b p-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex size-full items-center justify-between gap-2">
        {!isGroup ? (
          <div className="flex flex-none items-center gap-2">
            <Image
              src={image}
              alt={name}
              width={40}
              height={40}
              priority
              loading="eager"
              className="rounded-full border"
            />
            <div className="flex flex-col">
              <p className="font-semibold">{name}</p>
              <p className="line-clamp-1 text-xs">
                {online ? "Online" : fromNow(new Date(lastSeen))}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-none items-center gap-2">
            <Image
              src={image}
              alt={name}
              width={40}
              height={40}
              priority
              loading="eager"
              className="rounded-full border"
            />
            <div className="flex flex-col">
              <p className="font-semibold">{name}</p>
              <p className="text-muted-foreground line-clamp-1 text-xs">
                {memberonline.length} Online
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <CopyLink code={code} />
          <MemberTrigger />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
