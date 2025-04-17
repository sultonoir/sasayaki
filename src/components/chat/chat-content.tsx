import { fromNow } from "@/lib/from-now";
import { Messages } from "@/types";
import { Image } from "@unpic/react/nextjs";
import React from "react";
import ChatAttachment from "./chat-attachment";
import ChatActions from "./chat-actions";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import Linkify from "../ui/Linkify";
import UserTooltip from "../user/user-tooltip";
import { blurhashToDataUri } from "@unpic/placeholder";
import ChatParentMessage from "./chat-parent-message";

interface Props {
  message: Messages;
}

const ChatContent = ({ message }: Props) => {
  const blur = message.profile?.blur || "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm";
  const image = message.profile?.url || message.user.image || "/avatar.png";

  const { findMessage } = useChat();
  const parent = message.parent;
  return (
    <div
      id={message._id}
      className={cn(
        "hover:bg-sidebar-accent active:bg-sidebar-accent group/message relative isolate mx-4 flex flex-row gap-4 rounded-lg p-2 first:mt-2 last:mb-2",
        {
          "animate-pulse": findMessage === message._id,
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
            side="right"
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
      <ChatActions message={message} />
    </div>
  );
};

export default ChatContent;
