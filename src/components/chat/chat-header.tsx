import React from "react";
import { ServerChat } from "@/types";
import CopyLink from "../ui/copy-link";
import MemberTrigger from "../member/member-trigger";
import { ArrowLeft, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import SearchDesktop from "../search/search-desktop";
import { SearchMobile } from "../search/search-mobile";

interface ChatHeaderProps extends React.ComponentProps<"div"> {
  server: ServerChat;
}

const ChatHeader = React.memo(({ server, className }: ChatHeaderProps) => {
  const { toggleSidebar, isMobile } = useSidebar();
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b px-4 py-2",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button onClick={toggleSidebar} variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        )}
        <Hash />
        <p>{server.channel}</p>
      </div>
      <div className="flex items-center gap-2">
        <CopyLink code={server.code} />
        <MemberTrigger />
        <SearchDesktop />
        <SearchMobile />
      </div>
    </div>
  );
});

ChatHeader.displayName = "ChatHeader";
export default ChatHeader;
