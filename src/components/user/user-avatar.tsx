import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  name?: string;
  username?: string;
  online?: boolean;
}

export const UserAvatar = ({ src, name, online, className }: Props) => {
  return (
    <div className={cn("relative isolate flex-none flex-shrink-0", className)}>
      <Avatar className="size-8 rounded-full">
        <AvatarImage src={src || "/avatar.png"} alt={name} />
        <AvatarFallback className="rounded-lg">{name?.at(0)}</AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "border-secondary absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500",
          {
            "bg-muted": online === false,
          },
        )}
      >
        <span className="sr-only">Online</span>
      </span>
    </div>
  );
};
