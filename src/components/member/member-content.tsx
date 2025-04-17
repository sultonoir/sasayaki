import { cn } from "@/lib/utils";
import { Member } from "@/types";
import React from "react";
import { UserAvatar } from "../user/user-avatar";
import UserTooltip from "../user/user-tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface MemberContentProps extends React.ComponentProps<"div"> {
  member: Member;
}

const MemberContent = ({ member, className, ...props }: MemberContentProps) => {
  const blur = member.profile?.blur || "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm";
  const image = member.profile?.url || member.user.image || "/avatar.png";
  const isMobile = useIsMobile();
  return (
    <div
      className={cn("flex flex-row gap-4 first:mt-2 last:mb-2", className)}
      {...props}
    >
      <UserAvatar src={image} online={member.user.online} />
      <div className="flex flex-col">
        <UserTooltip
          userId={member.userId}
          name={member.username || member.user.name || ""}
          side={isMobile ? "bottom" : "left"}
          sideOffset={0}
          image={image}
          blur={blur}
        />
        <p className="text-muted-foreground max-w-[200px] truncate text-xs">
          {member.user.status}
        </p>
      </div>
    </div>
  );
};

export default MemberContent;
