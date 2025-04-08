import React from "react";
import { ServerChat } from "@/types";
import CopyLink from "../ui/copy-link";
import MemberTrigger from "../member/member-trigger";
import { Hash } from "lucide-react";

interface ChatHeaderProps {
  server: ServerChat;
}

const ChatHeader = React.memo(({ server }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-4">
        <Hash />
        <p>{server.channel}</p>
      </div>
      <div className="flex items-center gap-2">
        <CopyLink code={server.code} />
        <MemberTrigger />
      </div>
    </div>
  );
});

ChatHeader.displayName = "ChatHeader";
export default ChatHeader;
