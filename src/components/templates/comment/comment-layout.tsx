"use client";

import React from "react";
import ThreadsLoadingSkeleton from "../thread/thread-skeleton";
import InfiniteScrollContainer from "@/components/ui/infinite-scroll-container";
import { Loader2 } from "lucide-react";
import { CommentCard } from "./comment-card";
import { api } from "@/trpc/react";

interface Props {
  id: string;
  ownerId: string;
}

export const CommentLayout = ({ id, ownerId }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = api.comment.getComment.useInfiniteQuery(
    {
      id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: true, // Refetch when window is focused
    },
  );

  const comments = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.comments) ?? [];
  }, [data]);

  switch (status) {
    case "pending":
      return <ThreadsLoadingSkeleton />;
    case "success":
      if (!comments.length && !hasNextPage) {
        return (
          <p className="sr-only text-center text-muted-foreground">
            No one has posted anything yet.
          </p>
        );
      }
      return (
        <InfiniteScrollContainer
          onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
          <div className="divide-y-2">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                ownerId={ownerId}
              />
            ))}
          </div>
          {isFetchingNextPage && (
            <Loader2 className="mx-auto my-3 animate-spin" />
          )}
        </InfiniteScrollContainer>
      );
    case "error":
      return (
        <p className="text-center text-destructive">
          An error occurred while loading posts.
        </p>
      );
  }
};
