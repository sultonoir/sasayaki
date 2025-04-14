"use client";

import { BadgeCheck, LogOut, MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "../user/user-avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../ui/button";
import { useSession } from "@/provider/session-provider";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { Image } from "@unpic/react/nextjs";
import { blurhashToDataUri } from "@unpic/placeholder";

export function NavUser() {
  const { user } = useSession();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { toggle } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className="bg-secondary h-fit w-full border !p-2 focus-visible:ring-0"
        >
          <UserAvatar
            name={user?.name}
            src={user?.profile?.url}
            blur={user?.profile?.blur}
            online={user?.online}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {true ? "online" : "offline"}
            </span>
          </div>
          <MoreVertical className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-[340px] rounded-lg p-0"
        side={"top"}
        align="center"
        sideOffset={4}
      >
        {user?.banner ? (
          <Image
            src={user.banner.url}
            width={340}
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
              src={user?.profile?.url ?? "/avatar.png"}
              className="h-full w-full rounded-full object-cover"
              width={80}
              height={80}
              alt="Profile image"
              background={blurhashToDataUri(
                user?.profile?.blur ?? "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm",
                256,
                100,
              )}
            />
            <div className="bg-popover absolute -right-[10px] bottom-[5px] size-7 rounded-full p-1.5">
              {user?.online ? (
                <div className="size-full rounded-full bg-emerald-500"></div>
              ) : (
                <>
                  <div className="bg-muted-foreground size-full rounded-full p-1">
                    <div className="bg-popover size-full rounded-full"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 pb-0">
          <p className="pb-1 leading-none font-semibold">{user?.name}</p>
          <p className="text-muted-foreground pb-4 text-xs">{user?.username}</p>
        </div>
        <div className="p-4 pt-0">
          <div className="bg-muted/70 rounded-lg p-2">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={toggle} className="cursor-pointer">
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  signOut();
                  router.replace("/signin");
                }}
                className="cursor-pointer"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
