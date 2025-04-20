import { useChat } from "@/hooks/use-chat";
import { Reply } from "@/types";
import { blurhashToDataUri } from "@unpic/placeholder";
import { Image } from "@unpic/react/nextjs";
import { ImageIcon } from "lucide-react";
import React, { useRef } from "react";
import UserTooltip from "../user/user-tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatParentMessage = ({ parent }: { parent: Reply }) => {
  const { setFindMessage } = useChat();
  const blur = parent.profile?.blur || "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm";

  const isMobile = useIsMobile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFind = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Mencari elemen dengan id berdasarkan parent._id
    const element = document.getElementById(parent._id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth", // Untuk scroll yang halus
        block: "center", // Posisikan elemen di tengah layar
      });
      setFindMessage(parent._id);
    }
  };

  return (
    <div
      className="group/parent text-muted-foreground hover:text-foreground my-1 flex cursor-pointer items-center gap-2 text-xs"
      onClick={handleFind}
    >
      <div className="border-muted-foreground/50 group-hover/parent:border-foreground absolute top-4 left-[24px] h-[18px] w-[30px] rounded-tl-lg border-t-4 border-l-4 text-gray-600" />
      <Image
        src={parent.profile?.url || parent.user.image || "/avatar.png"}
        alt={parent.user.username || "unknown user"}
        width={15}
        height={15}
        layout="fixed"
        priority={true}
        loading="eager"
        background={blurhashToDataUri(blur)}
        className="rounded-full object-cover"
      />

      <UserTooltip
        userId={parent.user._id}
        name={parent.user.name ? `@${parent.user.name}` : "unknown name"}
        side={isMobile ? "bottom" : "right"}
        image={parent.profile?.url || parent.user.image || "/avatar.png"}
        blur={blur}
        sideOffset={10}
      />
      <p className="line-clamp-1 max-w-md">{parent.body}</p>
      {parent.attachment.length > 0 && <ImageIcon className="size-4" />}
    </div>
  );
};

export default ChatParentMessage;
