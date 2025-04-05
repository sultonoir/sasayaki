import { Doc, Id } from "@/convex/_generated/dataModel";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Loader2 } from "lucide-react";
import { getRandomColor } from "@/lib/random-color";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Image } from "@unpic/react/nextjs";

interface Props {
  userId: Id<"users">;
  name: string;
}

const UserTooltip: React.FC<Props> = ({ name, userId }) => {
  const colorname = getRandomColor(name);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          style={{ color: colorname }}
          className="cursor-pointer font-semibold hover:underline"
        >
          {name}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={2}
        side="right"
        className="w-fit overflow-hidden p-0"
        align="start"
      >
        <Content userId={userId} />
      </HoverCardContent>
    </HoverCard>
  );
};

function Content({ userId }: { userId: Id<"users"> }) {
  const {
    isPending,
    isError,
    data: user,
  } = useQuery(api.user.user_service.getUser, {
    id: userId,
  });

  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (isError || !user) return null;

  return (
    <div className="relative isolate flex size-full w-64 flex-col gap-4 px-4 first:px-0 first:pt-0 last:pb-4">
      <div className="h-[100px] w-full bg-sky-200"></div>
      <div className="relative isolate size-full">
        <div className="bg-card absolute -top-[65px] left-2.5 rounded-full p-1.5">
          <Image
            alt={user?.name || "unknown user"}
            src={user?.image || "/avatar.png"}
            layout="fixed"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />

          <div className="bg-card absolute -right-[5px] bottom-[10px] size-7 rounded-full p-1.5">
            <div className="size-full rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex size-full flex-col px-4">
        <h1 className="leading-none font-semibold">{user.name}</h1>
        <p className="text-muted-foreground text-xs">{user.username}</p>
      </div>
      <div className="px-4 text-xs">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo excepturi
        esse ad animi. Corporis eligendi praesentium et nostrum maxime
        molestiae.
      </div>
      {user.groups.length > 0 && (
        <div className="flex items-center gap-1 px-4">
          <AvatarGroup groups={user.groups} />
          <p className="text-muted-foreground text-xs capitalize">
            {user.groups.length} mutual server
          </p>
        </div>
      )}
    </div>
  );
}

function AvatarGroup({ groups }: { groups: Doc<"chat">[] }) {
  return (
    <div className="flex -space-x-1.5">
      {groups.map((group) => (
        <Image
          className="ring-background rounded-full ring-1"
          src={group.image}
          width={20}
          height={20}
          alt="Avatar 01"
          key={group._id}
        />
      ))}
    </div>
  );
}

export default UserTooltip;
