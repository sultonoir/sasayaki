/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { VList, VListHandle } from "virtua";
import { faker } from "@faker-js/faker";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Image } from "@unpic/react/nextjs";
import { fromNow } from "@/lib/from-now";
import ChatInput from "./chat-input";

interface Props {
  chatId: Id<"chat">;
}

const ChatBody = React.memo(({ chatId }: Props) => {
  const { status, loadMore, results } = usePaginatedQuery(
    api.message.message_service.getMessages,
    { chatId },
    { initialNumItems: 14 },
  );
  const ref = useRef<VListHandle>(null);
  const isPrepend = useRef(false);
  const shouldStickToBottom = useRef(true);

  useLayoutEffect(() => {
    isPrepend.current = false;
  }, []);

  useEffect(() => {
    if (!ref.current || !shouldStickToBottom.current) return;
    ref.current.scrollToIndex(results.length - 1, { align: "end" });
  }, [results.length]);

  const goingTobotom = useCallback(() => {
    shouldStickToBottom.current = true;
  }, []);
  return (
    <div className="flex size-full flex-col">
      <VList
        ref={ref}
        reverse
        className="grow"
        shift={isPrepend.current}
        onScroll={(offset) => {
          if (!ref.current) return;
          shouldStickToBottom.current =
            offset - ref.current.scrollSize + ref.current.viewportSize >= -1.5;

          if (offset < 100 && status === "CanLoadMore") {
            isPrepend.current = true;
            loadMore(5);
          }
        }}
      >
        {results
          .map((result) => (
            <div
              key={result._id}
              className="hover:bg-accent mx-4 flex flex-row gap-4 rounded-lg p-2 first:mt-2 last:mb-2"
            >
              <Image
                src={result.user.image!}
                alt={result.user.name!}
                width={40}
                height={40}
                layout="fixed"
                priority={true}
                loading="eager"
                className="rounded-full object-cover"
              />
              <div className="flex max-w-md flex-col">
                <p className="">
                  <span className="font-semibold capitalize">
                    {result.user.username}
                  </span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {fromNow(new Date(result._creationTime))}
                  </span>
                </p>
                <p className="text-sm">{result.body}</p>
              </div>
            </div>
          ))
          .reverse()}
      </VList>
      <ChatInput chatId={chatId} goingTobotom={goingTobotom} />
    </div>
  );
});

ChatBody.displayName = "ChatBody";
export default ChatBody;
