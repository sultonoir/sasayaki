"use client";

import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { UserWithFollowers } from "@/types";
import UserTooltip from "./user-tooltip";
import { cn } from "@/lib/utils";

interface UserLinkWithTooltipProps
  extends React.HtmlHTMLAttributes<HTMLAnchorElement> {
  username: string;
}

export default function UserLinkWithTooltip({
  children,
  username,
  className,
}: UserLinkWithTooltipProps) {
  const { data } = useQuery({
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

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className={cn("text-primary hover:underline", className)}>
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className={cn("text-primary hover:underline", className)}>
        {children}
      </Link>
    </UserTooltip>
  );
}
