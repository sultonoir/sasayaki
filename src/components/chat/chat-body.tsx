import React, { useEffect, useMemo, useRef } from "react";
import { VList, VListHandle } from "virtua";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ChatLoader from "./chat-loader";
import ChatContent from "./chat-content";
import ChatFooter from "./chat-footer";
import { useChat } from "@/hooks/use-chat";

interface Props {
  channelId: string;
}

const ChatBody = React.memo(({ channelId }: Props) => {
  const { loadMore, results, status } = usePaginatedQuery(
    api.message.message_service.getMessages,
    { channelId },
    { initialNumItems: 14 },
  );

  const listRef = useRef<VListHandle>(null);
  const shouldStickToBottomRef = useRef(true);
  const { shift, setShift } = useChat();

  useEffect(() => {
    if (!listRef.current) return;
    if (!shouldStickToBottomRef.current) return;

    listRef.current.scrollToIndex(results.length - 1, { align: "end" });
  }, [results.length]);

  const scrollToBottom = () => {
    shouldStickToBottomRef.current = true;
  };

  const handleScroll = (offset: number) => {
    if (!listRef.current) return;

    shouldStickToBottomRef.current =
      offset - listRef.current.scrollSize + listRef.current.viewportSize >=
      -1.5;

    if (offset < 100) {
      setShift(true);
      loadMore(10);
    }
  };

  const messages = useMemo(() => {
    return [...results].reverse();
  }, [results]);

  return (
    <>
      {status === "LoadingFirstPage" && (
        <div className="flex h-[calc(100svh-185px)] flex-col gap-2 overflow-y-auto p-3">
          <ChatLoader length={40} />
        </div>
      )}
      <VList
        ref={listRef}
        style={{ flex: 1 }}
        reverse
        shift={shift} // Hanya aktif saat load more
        onScroll={handleScroll}
        className="first:pt-5"
      >
        {messages.map((result) => (
          <ChatContent message={result} key={result._id} />
        ))}
      </VList>
      <ChatFooter goingTobotom={scrollToBottom} />
    </>
  );
});

ChatBody.displayName = "ChatBody";
export default ChatBody;
