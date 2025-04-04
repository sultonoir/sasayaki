import { fromNow } from "@/lib/from-now";
import { Messages, Reply } from "@/types";
import { Image } from "@unpic/react/nextjs";
import React from "react";
import ChatAttachment from "./chat-attachment";
import ChatActions from "./chat-actions";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { useChat } from "@/hooks/use-chat";

interface Props {
  message: Messages;
}

const ChatContent = ({ message }: Props) => {
  const { findMessage } = useChat();
  const parent = message.parent;

  return (
    <div
      id={message._id}
      className={cn(
        "hover:bg-accent group/message relative isolate mx-4 flex flex-row gap-4 rounded-lg p-2 first:mt-2 last:mb-2",
        {
          "animate-pulse": findMessage === message._id,
        },
      )}
    >
      <Image
        src={message.user.image!}
        alt={message.user.name!}
        width={40}
        height={40}
        layout="fixed"
        priority={true}
        loading="eager"
        className={cn("rounded-full object-cover", {
          "mt-[30px]": parent,
        })}
      />
      <div className="flex size-full max-w-md flex-col">
        {parent && <ParentContent parent={parent} />}
        <p>
          <span className="font-semibold capitalize">
            {message.user.username}
          </span>
          <span className="text-muted-foreground ml-2 text-xs">
            {fromNow(new Date(message._creationTime))}
          </span>
        </p>
        <p className="text-sm">{message.body}</p>
        {message.attachment.length > 0 && (
          <ChatAttachment attachments={message.attachment} />
        )}
      </div>
      <ChatActions message={message} />
    </div>
  );
};

function ParentContent({ parent }: { parent: Reply }) {
  const handleFind = () => {
    // Mencari elemen dengan id berdasarkan parent._id
    const element = document.getElementById(parent._id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth", // Untuk scroll yang halus
        block: "center", // Posisikan elemen di tengah layar
      });
    }
  };

  return (
    <div
      className="group/parent text-muted-foreground hover:text-foreground my-1 flex cursor-pointer items-center gap-2 text-xs"
      onClick={handleFind}
    >
      <div className="border-muted-foreground/50 group-hover/parent:border-foreground absolute top-4 left-[24px] h-[18px] w-[30px] rounded-tl-lg border-t-4 border-l-4 text-gray-600" />
      <Image
        src={parent.user.image || "/avatar.png"}
        alt={parent.user.username || "unknown user"}
        width={15}
        height={15}
        layout="fixed"
        priority={true}
        loading="eager"
        className="rounded-full object-cover"
      />

      <p>{parent.user.username}</p>
      <p className="line-clamp-1 max-w-md">{parent.body}</p>
      {parent.attachment.length > 0 && <ImageIcon className="size-4" />}
    </div>
  );
}

export default ChatContent;
