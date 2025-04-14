"use client";
import React, { useEffect } from "react";
import { useDialogGroup } from "@/hooks/use-dialog-group";
import { PageHeader } from "../ui/page-layouting";
import ChatHeader from "./chat-header";
import MemberLayout from "../member/member-layout";
import { ServerChat } from "@/types";
import ChatBody from "./chat-body";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Props {
  channelId: string;
  server: ServerChat;
}

const ChatLayout = ({ server, channelId }: Props) => {
  const { open } = useDialogGroup();
  const mutate = useMutation(api.read.read_service.createRead);

  useEffect(() => {
    void mutate({ channelId });
  }, [channelId, mutate]);

  return (
    <div className="flex size-full flex-col">
      <PageHeader
        title={server.name}
        url={server.image.url}
        blur={server.image.blur}
        type="image"
      />
      <ChatHeader server={server} className="border-y" />
      <div className="relative isolate flex size-full overflow-x-hidden">
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
