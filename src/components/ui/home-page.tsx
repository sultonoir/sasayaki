"use client";
import { Friend } from "@/types";
import React, { useMemo, useState } from "react";
import FriendIcon from "./friend-icon";
import { Button } from "./button";
import { Separator } from "./separator";
import { Label } from "./label";
import { Input } from "./input";
import {
  ArrowRightIcon,
  ChevronLeft,
  MessageCircle,
  SearchIcon,
} from "lucide-react";
import { UserAvatar } from "../user/user-avatar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/handle-eror";
import { useSidebar } from "./sidebar";

interface Props {
  friends: Friend[];
}

const HomePage = ({ friends }: Props) => {
  const [status, setStatus] = useState<"online" | "all">("all");
  const [search, setSearch] = useState("");
  const { toggleSidebar } = useSidebar();

  const FriendMemo = useMemo(() => {
    if (status === "online") {
      return friends.filter((f) => f.online === true);
    }

    if (search.trim() !== "") {
      const keyword = search.trim().toLowerCase();

      return friends.filter((f) => f.name?.toLowerCase().includes(keyword));
    }

    return friends;
  }, [friends, search, status]);

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleSidebar();
          }}
        >
          <ChevronLeft />
        </Button>
        <div className="flex items-center gap-2">
          <FriendIcon />
          Friends
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStatus("all");
          }}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStatus("online");
          }}
        >
          Online
        </Button>

        <Button size="sm">Add friend</Button>
      </div>
      <Separator className="mx-0" />
      <div className="px-4 *:not-first:mt-2">
        <Label htmlFor={"id"} className="sr-only">
          Search friend
        </Label>
        <div className="relative">
          <Input
            id={"id"}
            className="peer ps-9 pe-9"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
            type="submit"
          >
            <ArrowRightIcon size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {FriendMemo.map((friend) => (
          <Content key={friend._id} {...friend} />
        ))}
      </div>
    </>
  );
};

function Content(friend: Friend) {
  const mutate = useMutation(api.personal.personal_service.getDm);
  const router = useRouter();
  const handleClick = async () => {
    try {
      const result = await mutate({ otherId: friend._id });
      return router.push(`/dm/${result.personalId}/${result.otherId}`);
    } catch (error) {
      return handleError({ error, message: "Error create message" });
    }
  };
  return (
    <div className="flex items-center justify-between gap-4">
      <div key={friend._id} className="flex items-center gap-2">
        <UserAvatar
          name={friend.name}
          online={friend.online}
          blur={friend.profile?.blur}
          src={friend.profile?.url}
        />
        <p className="text-sm">{friend.name}</p>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" onClick={handleClick}>
            <MessageCircle />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Message</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default HomePage;
