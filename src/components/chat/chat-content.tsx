import { fromNow } from "@/lib/from-now";
import { Messages } from "@/types";
import { Image } from "@unpic/react/nextjs";
import React from "react";
import ChatAttachment from "./chat-attachment";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  message: Messages;
}

const ChatContent = ({ message }: Props) => {
  const mutate = useMutation(api.message.message_service.removeMessage);
  return (
    <div
      key={message._id}
      className="hover:bg-accent mx-4 flex flex-row gap-4 rounded-lg p-2 first:mt-2 last:mb-2"
    >
      <Image
        src={message.user.image!}
        alt={message.user.name!}
        width={40}
        height={40}
        layout="fixed"
        priority={true}
        loading="eager"
        className="rounded-full object-cover"
      />
      <div className="flex size-full max-w-md flex-col">
        <p className="">
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
    </div>
  );
};

export default ChatContent;
