import { fromNow } from "@/lib/from-now";
import { Messages } from "@/types";
import { Image } from "@unpic/react/nextjs";
import React, { useEffect, useRef, useState } from "react";
import ChatAttachment from "./chat-attachment";
import ChatActions from "./chat-actions";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import Linkify from "../ui/Linkify";
import UserTooltip from "../user/user-tooltip";
import { blurhashToDataUri } from "@unpic/placeholder";
import ChatParentMessage from "./chat-parent-message";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  message: Messages;
}

const ChatContent = ({ message }: Props) => {
  const [isTouched, setIsTouched] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  const isMobile = useIsMobile();
  const blur = message.profile?.blur || "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm";
  const image = message.profile?.url || message.user.image || "/avatar.png";

  const { findMessage, setFindMessage } = useChat();
  const parent = message.parent;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouch = () => {
    setIsTouched(true);

    // Bersihkan timeout sebelumnya kalau ada
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout baru
    timeoutRef.current = setTimeout(() => {
      setIsTouched(false);
    }, 3000);
  };

  // Bersihkan timeout saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Trigger highlight ketika findMessage cocok
  useEffect(() => {
    if (findMessage === message._id) {
      setHighlighted(true);

      const timer = setTimeout(() => {
        setHighlighted(false);
        setFindMessage(undefined);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [findMessage, message._id, setFindMessage]);

  return (
    <div
      id={message._id}
      onMouseDown={handleTouch}
      onTouchStart={handleTouch}
      className={cn(
        "hover:bg-sidebar-accent active:bg-sidebar-accent group/message relative isolate mx-4 flex cursor-pointer flex-row gap-4 rounded-lg p-2 first:mt-2 last:mb-2",
        {
          "bg-primary/10": highlighted,
        },
      )}
    >
      <Image
        src={image}
        alt={message.user.name || "unknown user"}
        width={40}
        height={40}
        layout="fixed"
        priority={true}
        loading="eager"
        background={blurhashToDataUri(blur)}
        className={cn("rounded-full object-cover", {
          "mt-[30px]": parent,
        })}
      />
      <div className="flex size-full max-w-md flex-col">
        {parent && <ChatParentMessage parent={parent} />}
        <div className="flex items-center">
          <UserTooltip
            userId={message.user._id}
            name={message.user.name || "unknown name"}
            side={isMobile ? "bottom" : "right"}
            image={image}
            blur={blur}
            sideOffset={10}
          />
          <span className="text-muted-foreground ml-2 text-xs">
            {fromNow(new Date(message._creationTime))}
          </span>
        </div>
        <div className="w-full overflow-hidden text-sm break-words whitespace-normal">
          <div className="break-all">
            <Linkify>{message.body}</Linkify>
          </div>
        </div>

        {message.attachment.length > 0 && (
          <ChatAttachment attachments={message.attachment} />
        )}
      </div>
      <ChatActions message={message} isTouched={isTouched} />
    </div>
  );
};

export default ChatContent;
