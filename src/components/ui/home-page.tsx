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
  UserCheck,
  UserPlus,
} from "lucide-react";
import { UserAvatar } from "../user/user-avatar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/handle-eror";
import { useSidebar } from "./sidebar";
import { Doc } from "@/convex/_generated/dataModel";

interface Props {
  friends: Friend[];
}

const HomePage = ({ friends }: Props) => {
  const [status, setStatus] = useState<"online" | "all" | "search">("all");
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
          variant={status === "all" ? "accent" : "ghost"}
          size="sm"
          onClick={() => {
            setStatus("all");
          }}
        >
          All
        </Button>
        <Button
          variant={status === "online" ? "accent" : "ghost"}
          size="sm"
          onClick={() => {
            setStatus("online");
          }}
        >
          Online
        </Button>

        <Button
          size="sm"
          variant={status === "search" ? "glow" : "default"}
          onClick={() => setStatus("search")}
        >
          Add friend
        </Button>
      </div>
      <Separator className="mx-0" />
      {status !== "search" ? (
        <>
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
      ) : (
        <SearchContent />
      )}
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

type Users = Doc<"users"> & {
  isFriend: boolean;
};

function SearchContent() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<Users[]>([]);
  const mutate = useMutation(api.user.user_service.searchUser);
  const addfriend = useMutation(api.friend.friend_service.addFriend);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await mutate({ username });
      setResults(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setResults([]);
      return;
    }
  };

  return (
    <>
      <div className="px-4 *:not-first:mt-2">
        <Label htmlFor={"id"} className="sr-only">
          Search friend
        </Label>
        <form onSubmit={handleSubmit} className="relative">
          <Label htmlFor="search friend" className="sr-only">
            Search friend
          </Label>
          <Input
            id="search friend"
            className="peer ps-9 pe-9"
            placeholder="Search..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        </form>
      </div>
      {results.map((friend) => (
        <div
          className="flex items-center justify-between gap-4 p-4"
          key={friend._id}
        >
          <div key={friend._id} className="flex items-center gap-2">
            <UserAvatar
              name={friend.name}
              online={friend.online}
              src={friend.image}
            />
            <p className="text-sm">{friend.name}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-0"
                onClick={() => addfriend({ friendId: friend._id })}
                aria-label={"friends"}
              >
                {friend.isFriend ? (
                  <UserCheck className="size-4" />
                ) : (
                  <UserPlus className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {friend.isFriend ? "remove" : "add"} friend
            </TooltipContent>
          </Tooltip>
        </div>
      ))}
    </>
  );
}

export default HomePage;
