import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Image } from "@unpic/react/nextjs";
import { blurhashToDataUri } from "@unpic/placeholder";
import { useChat } from "@/hooks/use-chat";

interface Props extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  name?: string;
  message?: string | null;
  media?: Doc<"attachment">[];
  isClosed?: boolean;
}

export const ChatReplyContent: React.FC<Props> = ({
  message,
  media,
  name,
  isClosed,
  ...prop
}) => {
  const { setReply } = useChat();
  const handleClose = () => {
    setReply(undefined);
  };
  return (
    <div
      {...prop}
      className={cn(
        "border-primary bg-secondary/40 relative flex w-full min-w-56 items-center justify-between border-l-2 py-2 pl-4",
        prop.className,
        {
          "pr-10": isClosed,
        },
      )}
    >
      <div className="flex flex-1 flex-col items-start justify-between py-2">
        <p className="text-xs font-semibold">{name}</p>
        <p className="text-muted-foreground line-clamp-2 text-xs">{message}</p>
      </div>
      {media && media?.length > 0 && (
        <div className="relative aspect-square size-11 flex-none flex-shrink-0 overflow-hidden rounded-sm">
          <Image
            width={44}
            height={44}
            layout="fixed"
            src={media[0].url ?? "/avatar.png"}
            background={blurhashToDataUri(media[0].blur)}
            alt="media"
            className="object-cover"
          />
        </div>
      )}
      {isClosed && (
        <Button
          startContent={<XIcon size={16} />}
          size="icon"
          className="absolute top-1 right-1 size-7 rounded-full"
          variant="outline"
          onClick={handleClose}
        />
      )}
    </div>
  );
};
