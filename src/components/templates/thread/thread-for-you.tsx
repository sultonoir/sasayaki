"use client";
import InfiniteScrollContainer from "@/components/ui/infinite-scroll-container";
import { Loader2 } from "lucide-react";
import ThreadsLoadingSkeleton from "./thread-skeleton";
import { ThreadCard } from "./thread-card";
import { useMemo } from "react";
import { api } from "@/trpc/react";

export default function ThreadForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = api.thread.getAllThreads.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: true, // Refetch when window is focused
    },
  );

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data],
  );

  switch (status) {
    case "pending":
      return <ThreadsLoadingSkeleton />;
    case "success":
      if (!posts.length && !hasNextPage) {
        return (
          <p className="text-center text-muted-foreground">
            No one has posted anything yet.
          </p>
        );
      }
      return (
        <InfiniteScrollContainer
          onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
          <div className="divide-y-2">
            {posts.map((post) => (
              <ThreadCard type="card" post={post} key={post.id} />
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
}
