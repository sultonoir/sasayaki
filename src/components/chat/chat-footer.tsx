"use client";
import React from "react";
import ChatInput from "./chat-input";
import { Id } from "@/convex/_generated/dataModel";
import { ChatReplyContent } from "./chat-reply-content";
import { useChat } from "@/hooks/use-chat";

interface Props {
  chatId: Id<"chat">;
  goingTobotom: () => void;
}

const ChatFooter = ({ chatId, goingTobotom }: Props) => {
  const { reply } = useChat();
  return (
    <div className="relative mx-auto w-full flex-none shrink-0 border-t">
      {reply && (
        <ChatReplyContent
          name={reply.user.username}
          isClosed={true}
          media={reply.attachment}
          message={reply.body}
        />
      )}
      <ChatInput chatId={chatId} goingTobotom={goingTobotom} />
    </div>
  );
};

export default ChatFooter;
