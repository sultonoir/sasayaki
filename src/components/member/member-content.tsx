import { cn } from "@/lib/utils";
import { Member } from "@/types";
import React from "react";
import { UserAvatar } from "../user/user-avatar";
import UserTooltip from "../user/user-tooltip";

interface MemberContentProps extends React.ComponentProps<"div"> {
  member: Member;
}

const MemberContent = ({ member, className, ...props }: MemberContentProps) => {
  return (
    <div
      className={cn("flex flex-row gap-4 first:mt-2 last:mb-2", className)}
      {...props}
    >
      <UserAvatar src={member.user.image} online={member.presence.isOnline} />
      <div className="flex flex-col">
        <UserTooltip
          userId={member.userId}
          name={member.username || member.user.name || ""}
          side="left"
          sideOffset={75}
        />
        <p className="text-muted-foreground text-[10px]">
          {member.user.status}
        </p>
      </div>
    </div>
  );
};

export default MemberContent;
