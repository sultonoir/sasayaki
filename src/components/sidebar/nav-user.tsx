"use client";

import {
  BadgeCheck,
  Bell,
  CreditCard,
  LaptopMinimal,
  LogOut,
  Moon,
  MoreVertical,
  Palette,
  Sparkles,
  Sun,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "../user/user-avatar";
import { useTheme } from "next-themes";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../ui/button";
import { useSession } from "@/provider/session-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavUser() {
  const { theme, setTheme } = useTheme();
  const { user } = useSession();
  const router = useRouter();
  const { signOut } = useAuthActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className="bg-muted/50 h-fit w-full border !p-2 focus-visible:ring-0"
        >
          <UserAvatar
            name={user?.name}
            src={user?.image}
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
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="right"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar
              name={user?.name}
              src={user?.image}
              online={user?.online}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/setting/profile">
              <BadgeCheck />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Palette size={16} className="text-muted-foreground" />
              Change theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  checked={theme === "light"}
                  onCheckedChange={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="size-4" />
                  Light
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={theme === "dark"}
                  onCheckedChange={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="size-4" />
                  Dark
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={theme === "system"}
                  onCheckedChange={() => setTheme("system")}
                  className="flex items-center gap-2"
                >
                  <LaptopMinimal className="size-4" />
                  System
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            signOut();
            router.replace("/signin");
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
