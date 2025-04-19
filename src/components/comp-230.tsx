import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { blurhashToDataUri } from "@unpic/placeholder";
import { Image } from "@unpic/react/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useSession } from "@/provider/session-provider";
import { useServerProfile } from "@/hooks/use-server-profile";

interface Servers extends Doc<"server"> {
  image: Doc<"serverImage">;
  username?: string;
  memberId: Id<"member">;
}

interface Props {
  servers: Servers[];
}

export default function UserServerProfile({ servers }: Props) {
  const { server } = useParams<{ server: Id<"server"> }>();
  const { user } = useSession();
  const {
    status,
    setStatus,
    setSelectedServer,
    selectedServer,
    changeUsername,
  } = useServerProfile();
  const initalValue = servers.find((item) => item._id === server);

  useEffect(() => {
    if (initalValue) {
      setSelectedServer({
        serverId: initalValue?._id,
        memberId: initalValue?.memberId,
        username: initalValue?.username,
      });
    }
  }, [initalValue, setSelectedServer]);

  return (
    <div className="space-y-5">
      <Select
        defaultValue={initalValue?._id}
        disabled={status !== undefined}
        onValueChange={(value) => {
          const newValue = servers.find((item) => item._id === value);
          if (newValue) {
            setSelectedServer({
              serverId: newValue._id,
              memberId: newValue.memberId,
              username: newValue.username,
            });
          }
        }}
      >
        <SelectTrigger className="w-full ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
          <SelectValue placeholder="Select server" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            <SelectLabel className="ps-2">Select server</SelectLabel>
            {servers.map((server) => (
              <SelectItem key={server._id} value={server._id}>
                <Image
                  className="size-5 rounded"
                  src={server.image.url}
                  alt={server.name}
                  background={blurhashToDataUri(server.image.blur)}
                  width={20}
                  height={20}
                />
                <span className="truncate capitalize">{server.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-5">
        <div className="hidden space-y-2 md:block">
          <Label htmlFor="server-nickname">Server Nickname</Label>
          <Input
            id="server-nickname"
            placeholder="Matt"
            type="text"
            required
            value={selectedServer?.username ?? ""}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length < 32) {
                changeUsername(newValue);
                setStatus("initial");
              }
            }}
          />
        </div>
        <div className="flex size-full flex-col items-center">
          <div className="h-fit w-full flex-none shrink-0 overflow-hidden rounded-lg border md:max-w-[260px]">
            {user?.banner ? (
              <Image
                src={user?.banner.url}
                width={370}
                height={96}
                alt={user?.name}
                background={blurhashToDataUri(user?.banner.blur, 256, 100)}
              />
            ) : (
              <div className="h-[100px] w-full bg-rose-200"></div>
            )}
            <div className="-mt-10 px-3">
              <div className="border-secondary bg-muted group/banner relative flex size-20 items-center justify-center rounded-full border-4 shadow-xs shadow-black/10">
                <Image
                  src={user?.profile?.url ?? "/avatar.png"}
                  className="h-full w-full rounded-full object-cover"
                  width={80}
                  height={80}
                  alt="Profile image"
                />
                <div className="bg-secondary absolute -right-[10px] bottom-[5px] size-7 rounded-full p-1.5">
                  {user?.online ? (
                    <div className="size-full rounded-full bg-emerald-500"></div>
                  ) : (
                    <>
                      <div className="bg-muted-foreground size-full rounded-full p-1">
                        <div className="bg-secondary size-full rounded-full"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full overflow-hidden text-sm break-words whitespace-normal">
                <div className="break-all">
                  <p className="pb-1 leading-none font-semibold">
                    {selectedServer?.username}
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <p className="text-muted-foreground max-w-xs truncate pb-4 text-xs">
                  {user?.status}
                </p>
                <div className="hover:bg-accent group bg-accent/80 inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-center text-xs">
                  Example button
                </div>
              </div>

              <div className="block space-y-2 rounded-xl bg-white/5 p-4 text-xs md:hidden">
                <p>About me</p>
                <p className="pb-2">{user?.status}</p>
                <p>Member since</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
