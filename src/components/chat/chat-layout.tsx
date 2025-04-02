"use client";
import React from "react";
import ChatHeader from "./chat-header";
import { useDialogGroup } from "@/hooks/use-dialog-group";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import MemberLayout from "../member/member-layout";
import ChatBody from "./chat-body";

interface Props {
  preload: Preloaded<typeof api.chat.chat_service.getChatByIdWithMembers>;
}

const ChatLayout = ({ preload }: Props) => {
  const { open } = useDialogGroup();

  const data = usePreloadedQuery(preload);

  if (!data) return notFound();

  return (
    <>
      <ChatHeader {...data} />
      <div className="relative isolate flex size-full overflow-x-hidden">
        {/* Chat body */}
        <div
          data-state={open ? "open" : "close"}
          className="bg-card flex size-full flex-col transition-all duration-300 ease-in-out will-change-transform data-[state=open]:lg:mr-[300px]"
        >
          <ChatBody chatId={data._id} />
        </div>
        <MemberLayout members={data.members} />
      </div>
    </>
  );
};

export default ChatLayout;
