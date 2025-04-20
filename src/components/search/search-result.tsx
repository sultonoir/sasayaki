"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircleMore, Reply } from "lucide-react";
import { Member, Messages } from "@/types";
import { fromNow } from "@/lib/from-now";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ChatLoader from "../chat/chat-loader";
import { useChat } from "@/hooks/use-chat";
import { UserAvatar } from "../user/user-avatar";
import ChatAttachment from "../chat/chat-attachment";
import Linkify from "../ui/Linkify";
import ChatParentMessage from "../chat/chat-parent-message";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/handle-eror";
import { api } from "@/convex/_generated/api";

interface SearchResultProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: React.HTMLAttributes<HTMLDivElement>;
  result?: { messages: Messages[]; members: Member[] };
  loading: boolean;
  close: () => void;
}

export const SearchResults = ({
  result,
  loading,
  close,
  className,
}: SearchResultProps) => {
  const hasMessages = result && result.messages.length > 0;
  const hasMembers = result && result.members.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex max-h-72 w-full flex-col gap-2 overflow-y-auto pr-3",
        className,
      )}
    >
      {loading ? (
        <ChatLoader />
      ) : !hasMessages && !hasMembers ? (
        <div className="text-muted-foreground p-3 text-sm">
          What you are looking for is not there.
        </div>
      ) : (
        <>
          {hasMembers && (
            <>
              <p className="p-2 text-sm font-medium">Members</p>
              <Separator className="mx-0" />
              {result.members.map((member) => (
                <SearchMemberCard
                  key={member._id}
                  member={member}
                  close={close}
                />
              ))}
            </>
          )}
          {hasMessages && (
            <>
              <p className="p-2 text-sm font-medium">Messages</p>
              <Separator className="mx-0" />
              {result.messages.map((message) => (
                <SearchCard key={message._id} message={message} close={close} />
              ))}
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

interface SearchCardProps {
  message: Messages;
  close: () => void;
}

function SearchCard({ message, close }: SearchCardProps) {
  const { setReply } = useChat();

  const handleReply = () => {
    setReply(message);
    setTimeout(() => {
      close(); // panggil setelah 150ms = durasi exit
    }, 150);
  };

  return (
    <div className="group/message hover:bg-sidebar-accent relative isolate flex w-full flex-row gap-4 rounded-lg p-2">
      <UserAvatar
        src={message.profile?.url}
        name={message.user.name}
        blur={message.profile?.blur}
        online={message.user.online}
        className={cn("size-fit rounded-full object-cover", {
          "mt-[30px]": message.parent,
        })}
      />
      <div className="flex-1">
        {message.parent && <ChatParentMessage parent={message.parent} />}

        <div className="flex items-center gap-2">
          <p className="leading-none font-semibold capitalize">
            {message.user.name}
          </p>
          <span className="text-muted-foreground">-</span>
          <p className="text-muted-foreground text-xs">
            {fromNow(new Date(message._creationTime))}
          </p>
        </div>

        <div className="w-full text-sm break-words">
          <div className="break-all">
            <Linkify>{message.body}</Linkify>
          </div>
        </div>

        {message.attachment.length > 0 && (
          <ChatAttachment attachments={message.attachment} />
        )}
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="size-7 rounded-full"
        onClick={handleReply}
        aria-label="Reply"
      >
        <Reply size={16} />
      </Button>
    </div>
  );
}

interface SearchMemberCardProps {
  member: Member;
  close: () => void;
}

function SearchMemberCard({ member, close }: SearchMemberCardProps) {
  const mutate = useMutation(api.personal.personal_service.getDm);
  const router = useRouter();
  const handleClick = async () => {
    try {
      const result = await mutate({ otherId: member.userId });
      return router.push(`/dm/${result.personalId}/${result.otherId}`);
    } catch (error) {
      return handleError({ error, message: "Error create message" });
    }
  };

  return (
    <div
      className="hover:bg-sidebar-accent flex w-full cursor-pointer items-center gap-3 rounded-lg p-2"
      onClick={close}
    >
      <UserAvatar
        src={member.profile?.url}
        name={member.username}
        blur={member.profile?.blur}
        online={member.user.online}
        className="size-fit rounded-full object-cover"
      />
      <div className="flex flex-1 flex-col">
        <p className="text-sm font-medium">{member.username}</p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="size-7 rounded-full"
        aria-label="send message"
        onClick={handleClick}
      >
        <MessageCircleMore />
      </Button>
    </div>
  );
}
