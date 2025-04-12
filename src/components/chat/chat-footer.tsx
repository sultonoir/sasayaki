"use client";
import React from "react";
import ChatInput from "./chat-input";
import { ChatReplyContent } from "./chat-reply-content";
import { useChat } from "@/hooks/use-chat";

interface Props {
  goingTobotom: () => void;
}

const ChatFooter = ({ goingTobotom }: Props) => {
  const { reply } = useChat();
  return (
    <div className="relative flex flex-none shrink-0 flex-col gap-2">
      {reply && (
        <ChatReplyContent
          name={reply.user.username}
          isClosed={true}
          media={reply.attachment}
          message={reply.body}
        />
      )}
      <ChatInput goingTobotom={goingTobotom} />
    </div>
  );
};

export default ChatFooter;
