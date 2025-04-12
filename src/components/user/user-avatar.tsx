import React from "react";
import { cn } from "@/lib/utils";
import { Image } from "@unpic/react/nextjs";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  name?: string;
  username?: string;
  online?: boolean;
}

export const UserAvatar = ({
  src = "/avatar.png",
  name,
  online,
  className,
}: Props) => {
  return (
    <div className={cn("relative isolate flex-none flex-shrink-0", className)}>
      <Image
        src={src}
        alt={name}
        width={38}
        height={38}
        layout="fixed"
        priority={true}
        loading="eager"
        className="rounded-full object-cover"
      />
      <span
        className={cn(
          "border-card absolute -end-0.5 bottom-0.5 size-3 rounded-full border-2 bg-emerald-500",
          {
            "bg-muted": !online,
          },
        )}
      >
        <span className="sr-only">Online</span>
      </span>
    </div>
  );
};
