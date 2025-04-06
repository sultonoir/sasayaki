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
import { useSession } from "@/hooks/use-session";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Emoji from "../ui/emoji";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/handle-eror";
import { Button } from "../ui/button";
import { useToolTip } from "@/hooks/use-tooltip";
import { blurhashToDataUri } from "@unpic/placeholder";

interface Props {
  userId: Id<"users">;
  messageId: Id<"message">;
  name: string;
  side?: "right" | "top" | "bottom" | "left";
}

interface ContnetProps {
  userId: Id<"users">;
  username?: string;
}

const UserTooltip: React.FC<Props> = ({
  name,
  userId,
  side,
  messageId: message,
}) => {
  const colorname = getRandomColor(name);
  const { setMessageId, messageId } = useToolTip();

  const onOpenChange = (open: boolean) => {
    if (open === true) {
      setMessageId(message);
    } else {
      setMessageId("");
    }
  };
  return (
    <HoverCard open={message === messageId} onOpenChange={onOpenChange}>
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
        side={side}
        className="w-fit overflow-hidden p-0"
        align="start"
      >
        <Content userId={userId} />
      </HoverCardContent>
    </HoverCard>
  );
};

function Content({ userId }: ContnetProps) {
  const { user: session } = useSession();
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
      {user.banner ? (
        <Image
          src={user.banner.url}
          width={256}
          height={100}
          alt={user.name || "unknown user"}
          background={blurhashToDataUri(user.banner.blur, 256, 100)}
        />
      ) : (
        <div className="h-[100px] w-full bg-sky-200"></div>
      )}
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
            {user.presence?.isOnline ? (
              <div className="size-full rounded-full bg-emerald-500"></div>
            ) : (
              <>
                <div className="bg-muted-foreground size-full rounded-full p-1">
                  <div className="bg-card size-full rounded-full"></div>
                </div>
              </>
            )}
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
      {user.groups.length > 0 && userId !== session?._id && (
        <div className="flex items-center gap-1 px-4">
          <AvatarGroup groups={user.groups} />
          <p className="text-muted-foreground text-xs capitalize">
            {user.groups.length} mutual server
          </p>
        </div>
      )}

      {session?._id !== user._id && (
        <FormSendDm userId={user._id} username={user.username} />
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

function FormSendDm({ userId, username }: ContnetProps) {
  const [body, setBody] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const { user } = useSession();
  const { setMessageId } = useToolTip();

  const mutate = useMutation(api.chat.chat_service.createDm);

  const router = useRouter();
  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    if (!user) {
      return router.push("/signin");
    }

    try {
      await mutate({ message: body, other: userId });
    } catch (error) {
      setIsPending(false);
      return handleError({ error, message: "Error send dm" });
    }
    setIsPending(false);
    setBody("");
    setMessageId("");
  };
  return (
    <form className="px-4 *:not-first:mt-2" onSubmit={handleSumbit}>
      <Label className="sr-only" htmlFor={userId}>
        send dm to {userId}
      </Label>
      <div className="relative">
        <Input
          id={userId}
          className="pe-9"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isPending}
          placeholder={`Message to @${username}`}
          type="text"
        />
        <div className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
          <Emoji
            type="button"
            className="bg-transparent dark:bg-transparent"
            onEmojiSelect={(e) => setBody((prev) => prev + e)}
          />
        </div>
        <Button type="submit" className="hidden" />
      </div>
    </form>
  );
}

export default UserTooltip;
