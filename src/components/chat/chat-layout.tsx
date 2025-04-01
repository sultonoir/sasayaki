"use client";
import React from "react";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import { useDialogGroup } from "@/hooks/use-dialog-group";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Props {
  preload: Preloaded<typeof api.group.group_service.getGroupMetadata>;
  type: string;
}

const ChatLayout = ({ preload }: Props) => {
  const { open } = useDialogGroup();

  console.log(preload);
  return (
    <>
      <ChatHeader />
      <div className="relative isolate size-full overflow-x-hidden">
        {/* Chat body */}
        <div
          data-state={open ? "open" : "close"}
          className="flex h-full flex-col"
        >
          <div className="flex h-96 grow flex-col gap-1 overflow-y-auto p-4">
            {Array.from({ length: 100 }).map((_, index) => (
              <div key={index} className="bg-accent w-full rounded-lg p-4">
                {index}
              </div>
            ))}
          </div>
          <ChatInput />
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
