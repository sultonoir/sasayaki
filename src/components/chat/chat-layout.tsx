/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { useDialogGroup } from "@/hooks/use-dialog-group";
import { PageContainer, PageHeader } from "../ui/page-layouting";
import { Doc } from "@/convex/_generated/dataModel";
import ChatLoader from "./chat-loader";
import ChatHeader from "./chat-header";
import MemberLayout from "../member/member-layout";
import { ServerChat } from "@/types";
import ChatBody from "./chat-body";

interface Props {
  channelId: string;
  server: ServerChat;
}

const ChatLayout = ({ server, channelId }: Props) => {
  const { open } = useDialogGroup();

  return (
    <div className="flex size-full flex-col">
      <PageHeader
        title={server.name}
        url={server.image.url}
        blur={server.image.blur}
        type="image"
      />
      <ChatHeader server={server} className="border-t border-l" />
      <div className="relative isolate flex size-full overflow-x-hidden border-l">
        <div
          data-state={open ? "open" : "close"}
          className="bg-card flex size-full flex-col transition-all duration-300 ease-in-out will-change-transform data-[state=open]:lg:mr-[300px]"
        >
          <ChatBody channelId={channelId} />
        </div>
        <MemberLayout />
      </div>
    </div>
  );
};

export default ChatLayout;
