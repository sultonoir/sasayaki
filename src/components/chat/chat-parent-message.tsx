import { Reply } from "@/types";
import { blurhashToDataUri } from "@unpic/placeholder";
import { Image } from "@unpic/react/nextjs";
import { ImageIcon } from "lucide-react";
import React from "react";

const ChatParentMessage = ({ parent }: { parent: Reply }) => {
  const blur = parent.profile?.blur || "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm";
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

      <p>{parent.user.username}</p>
      <p className="line-clamp-1 max-w-md">{parent.body}</p>
      {parent.attachment.length > 0 && <ImageIcon className="size-4" />}
    </div>
  );
};

export default ChatParentMessage;
