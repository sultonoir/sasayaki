import { Doc, Id } from "@/convex/_generated/dataModel";
import React from "react";
import { Edit2Icon, Loader2, PlusIcon } from "lucide-react";
import { getRandomColor } from "@/lib/random-color";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Image } from "@unpic/react/nextjs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Emoji from "../ui/emoji";
import { useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { handleError } from "@/lib/handle-eror";
import { Button } from "../ui/button";
import { useToolTip } from "@/hooks/use-tooltip";
import { blurhashToDataUri } from "@unpic/placeholder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "../ui/badge";
import { useSession } from "@/provider/session-provider";
import { useModal } from "@/hooks/use-modal";

interface Props {
  userId: Id<"users">;
  name: string;
  side?: "right" | "top" | "bottom" | "left";
  image?: string;
  blur?: string;
  sideOffset?: number;
}

interface ContnetProps {
  userId: Id<"users">;
  username?: string;
  image: string;
  blur: string;
}

const UserTooltip: React.FC<Props> = ({
  name,
  userId,
  side,
  sideOffset,
  image,
  blur,
}) => {
  const blurImage = blur || "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm";
  const profileImage = image || "/avatar.png";
  const colorname = getRandomColor(name);
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          style={{ color: colorname }}
          className="cursor-pointer font-semibold hover:underline"
        >
          {name}
        </div>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={sideOffset}
        side={side}
        className="w-fit overflow-hidden rounded-lg p-0"
        align="start"
      >
        <Content
          userId={userId}
          username={name}
          blur={blurImage}
          image={profileImage}
        />
      </PopoverContent>
    </Popover>
  );
};

function Content({ userId, username, image, blur }: ContnetProps) {
  const { toggle } = useModal();
  const { user: session } = useSession();
  const { server } = useParams<{ server: Id<"server"> }>();
  const {
    isPending,
    isError,
    data: user,
  } = useQuery(api.user.user_service.getUser, {
    id: userId,
    serverId: server,
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
          height={96}
          alt={user.name || "unknown user"}
          background={blurhashToDataUri(user.banner.blur, 256, 100)}
        />
      ) : (
        <div className="h-[100px] w-full bg-rose-200"></div>
      )}
      <div className="relative isolate size-full">
        <div className="bg-card absolute -top-[65px] left-2.5 rounded-full p-1.5">
          <Image
            alt={user?.name || "unknown user"}
            src={image}
            layout="fixed"
            width={72}
            height={72}
            background={blurhashToDataUri(blur)}
            className="rounded-full object-cover"
          />

          <div className="bg-card absolute -right-[5px] bottom-[10px] size-7 rounded-full p-1.5">
            {user.online ? (
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
      <div className="mt-4 flex size-full flex-col gap-1 px-4">
        <h1 className="leading-none font-semibold">{username}</h1>
        <p className="text-muted-foreground text-xs">{user.username}</p>
      </div>
      {user.status && <div className="px-4 text-xs">{user.status}</div>}
      {user.groups.length > 0 && userId !== session?._id && (
        <div className="flex items-center gap-1 px-4">
          <AvatarGroup groups={user.groups} />
          <p className="text-muted-foreground text-xs capitalize">
            {user.groups.length} mutual server
          </p>
        </div>
      )}

      {user.roles.length === 0 ? (
        <Badge variant="outline" className="mx-4">
          <PlusIcon className="size-4" />
          <span className="text-muted-foreground text-[10px]">Add role</span>
        </Badge>
      ) : (
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <Badge key={role._id}>
              <span
                className="size-4 flex-none rounded-lg"
                style={{ background: role.color }}
              />
              {role.name}
            </Badge>
          ))}
        </div>
      )}

      {session?._id !== user._id ? (
        <FormSendDm userId={user._id} username={username} />
      ) : (
        <button
          onClick={toggle}
          className="bg-accent/80 hover:bg-accent mx-4 inline-flex items-center justify-center gap-2 rounded-md border py-1.5 text-xs outline-none focus:ring-0"
        >
          <Edit2Icon className="size-3" />
          Edit profile
        </button>
      )}
    </div>
  );
}

type Groups = Doc<"server"> & {
  image: Doc<"serverImage">;
};
interface AvatarGroupProps {
  groups: Groups[];
}

function AvatarGroup({ groups }: AvatarGroupProps) {
  return (
    <div className="flex -space-x-1.5">
      {groups.map((group) => (
        <Image
          className="ring-background rounded-full ring-1"
          src={group.image.url}
          width={20}
          height={20}
          alt="Avatar 01"
          background={blurhashToDataUri(group.image.blur)}
          key={group._id}
        />
      ))}
    </div>
  );
}

interface FormSendDmProps {
  userId: Id<"users">;
  username?: string;
}
function FormSendDm({ userId, username }: FormSendDmProps) {
  const [body, setBody] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const { user } = useSession();
  const { setMessageId } = useToolTip();

  const mutate = useMutation(api.personal.personal_service.createDm);

  const router = useRouter();
  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    if (!user) {
      return router.push("/signin");
    }

    try {
      await mutate({ body, otherId: userId });
    } catch (error) {
      setIsPending(false);
      return handleError({ error, message: "Error send dm" });
    }
    setIsPending(false);
    setBody("");
    setMessageId("");
  };

  function getPlaceholder(): string {
    if (!username) return "";

    return username.length > 8 ? username.slice(0, 8) + "..." : username;
  }
  return (
    <form className="px-4 *:not-first:mt-2" onSubmit={handleSumbit}>
      <Label className="sr-only" htmlFor={userId}>
        send dm to {userId}
      </Label>
      <div className="relative">
        <Input
          id={userId}
          className="pe-9 placeholder:text-xs"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isPending}
          placeholder={`Message @${getPlaceholder()}`}
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
