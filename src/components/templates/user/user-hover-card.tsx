import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import React from "react";
import { FollowerInfo, UserWithFollowers } from "@/types";
import { useQuery } from "@tanstack/react-query";
import ky, { HTTPError } from "ky";
import { useSession } from "@/provider/session-provider";
import Link from "next/link";
import UserAvatar from "./user-avatar";
import FollowButton from "../follower/follower-button";
import Linkify from "@/components/ui/linkify";
import FollowerCount from "../follower/follower-count";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  username: string;
}

export function UserHoverCard({ children, username }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <HoverCard
      open={open}
      onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      {open && (
        <HoverCardContent className="w-80">
          <HoverContent username={username} />
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

function HoverContent({ username }: { username: string }) {
  const { user: loggedInUser } = useSession();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () => ky.get(`/v1/user/${username}`).json<UserWithFollowers>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  const followerState: FollowerInfo = {
    followers: user?._count.followers ?? 0,
    isFollowedByUser: !!user?.followers.some(
      ({ followerId }) => followerId === loggedInUser?.id
    ),
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse space-y-3 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-1/4 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-16 rounded" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex max-w-80 w-full flex-col gap-3 break-words px-1 py-2.5 md:min-w-52 bg-card">
      <div className="flex items-center justify-between gap-2">
        <Link href={`/users/${user?.username}`}>
          <UserAvatar
            size={50}
            avatarUrl={user?.image}
          />
        </Link>
        {loggedInUser?.id !== user?.id && (
          <FollowButton
            userId={user.id}
            initialState={followerState}
          />
        )}
      </div>
      <div>
        <Link href={`/users/${user.username}`}>
          <div className="text-lg font-semibold hover:underline">
            {user.name}
          </div>
          <div className="text-muted-foreground">@{user.username}</div>
        </Link>
      </div>
      {user.status && (
        <Linkify>
          <div className="line-clamp-4 whitespace-pre-line">{user.status}</div>
        </Linkify>
      )}
      <div className="flex flex-wrap gap-5">
        <FollowerCount
          userId={user.id}
          initialState={followerState}
        />
        <div>
          Following:{" "}
          <span className="font-semibold">
            {formatNumber(user._count.following)}
          </span>
        </div>
      </div>
    </div>
  );
}
