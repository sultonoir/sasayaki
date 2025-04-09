import React, { useRef } from "react";
import { VList, VListHandle } from "virtua";
import { Skeleton } from "../ui/skeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import MemberContent from "./member-content";

const MemberBody = () => {
  const { server } = useParams<{ server: Id<"server"> }>();
  const {
    results: members,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.member.member_service.getMemberByServer,
    { id: server },
    { initialNumItems: 20 },
  );
  const listRef = useRef<VListHandle>(null);

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (status !== "Exhausted") {
        loadMore(10);
      }
    },
    { threshold: 0.1 },
  );
  return (
    <VList ref={listRef} className="px-4">
      {status === "LoadingFirstPage" && (
        <>
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              className="flex items-center space-x-4 first:mt-2 last:mb-2"
              key={index}
            >
              <Skeleton className="h-12 w-12 flex-none rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </>
      )}
      {members.map((member) => (
        <MemberContent member={member} key={member._id} />
      ))}
      <div ref={loadMoreRef} className="flex h-10 items-center justify-center">
        {status === "CanLoadMore" && (
          <div className="text-muted-foreground text-sm">Loading...</div>
        )}
      </div>
    </VList>
  );
};

export default MemberBody;
