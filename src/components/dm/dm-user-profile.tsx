import { useDialogGroup } from "@/hooks/use-dialog-group";
import { DmPage, Friend } from "@/types";
import { blurhashToDataUri } from "@unpic/placeholder";
import { Image } from "@unpic/react/nextjs";
import { formatDate } from "date-fns";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { handleError } from "@/lib/handle-eror";
import { useRouter } from "next/navigation";

interface Props {
  user: DmPage;
}

const DmUserProfile = ({ user }: Props) => {
  const { open } = useDialogGroup();
  return (
    <div
      data-state={open ? "open" : "close"}
      className="bg-secondary absolute inset-y-0 right-0 w-full transform border-l transition-all duration-300 ease-in-out will-change-transform data-[state=close]:translate-x-full data-[state=open]:translate-x-0 lg:w-[300px]"
    >
      {user.banner ? (
        <Image
          src={user.banner.url}
          width={370}
          height={96}
          alt={user.name}
          background={blurhashToDataUri(user.banner.blur, 256, 100)}
        />
      ) : (
        <div className="h-[100px] w-full bg-rose-200"></div>
      )}
      <div className="-mt-10 px-3">
        <div className="border-secondary bg-muted group/banner relative flex size-20 items-center justify-center rounded-full border-4 shadow-xs shadow-black/10">
          <Image
            src={user.image ?? "/avatar.png"}
            className="h-full w-full rounded-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
          <div className="bg-secondary absolute -right-[10px] bottom-[5px] size-7 rounded-full p-1.5">
            {user.online ? (
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
        <p className="pb-1 leading-none font-semibold">{user.name}</p>
        <p className="text-muted-foreground pb-4 text-xs">{user.username}</p>

        <div className="space-y-2 rounded-xl bg-white/5 p-4 text-xs">
          <p>About me</p>
          <p className="pb-2">{user.status}</p>
          <p>Member since</p>
          <p>{formatDate(user._creationTime, "MMM d, yyyy")}</p>
        </div>
      </div>
      {user.groups.length > 0 && (
        <div className="p-4 pt-0">
          <div className="rounded-xl bg-white/5 p-4">
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-sm">
                Mututal Servers - {user.groups.length}
                <ChevronsUpDown className="size-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {user.groups.map((item) => (
                  <Link
                    href={`/server/${item._id}/${item.channel._id}`}
                    key={item._id}
                    className="mt-4 flex items-center gap-2 rounded-lg px-1 py-2 text-sm hover:bg-white/5"
                  >
                    <Image
                      src={item.image.url ?? "/avatar.png"}
                      className="h-full w-full rounded-full object-cover"
                      width={40}
                      height={40}
                      background={blurhashToDataUri(item.image.blur)}
                      alt="Profile image"
                    />
                    <p>{item.name}</p>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}
      {user.friends.length > 0 && <Friends friends={user.friends} />}
    </div>
  );
};

function Friends({ friends }: { friends: Friend[] }) {
  const mutate = useMutation(api.personal.personal_service.getDm);
  const router = useRouter();
  const handleClick = async (id: Id<"users">) => {
    try {
      const result = await mutate({ otherId: id });
      return router.push(`/dm/${result.personalId}/${result.otherId}`);
    } catch (error) {
      return handleError({ error, message: "Error create message" });
    }
  };
  return (
    <div className="p-4 pt-0">
      <div className="rounded-xl bg-white/5 p-4">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm">
            Mututal Friends - {friends.length}
            <ChevronsUpDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {friends.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="mt-4 flex items-center gap-2 rounded-lg px-1 py-2 text-sm hover:bg-white/5"
              >
                <Image
                  src={item.profile?.url ?? "/avatar.png"}
                  className="h-full w-full rounded-full object-cover"
                  width={40}
                  height={40}
                  background={blurhashToDataUri(
                    item.profile?.blur ??
                      "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm",
                  )}
                  alt="Profile image"
                />
                <p>{item.name}</p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

export default DmUserProfile;
