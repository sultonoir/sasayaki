import React, {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { VList, VListHandle } from "virtua";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatInput from "./chat-input";
import ChatLoader from "./chat-loader";
import ChatContent from "./chat-content";

interface Props {
  chatId: Id<"chat">;
}

const ChatBody = React.memo(({ chatId }: Props) => {
  const { loadMore, results, status } = usePaginatedQuery(
    api.message.message_service.getMessages,
    { chatId },
    { initialNumItems: 14 },
  );

  const listRef = useRef<VListHandle>(null);
  const isPrependRef = useRef(false);
  const shouldStickToBottomRef = useRef(true);

  useLayoutEffect(() => {
    isPrependRef.current = false;
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!listRef.current) return;
    if (!shouldStickToBottomRef.current) return;

    listRef.current.scrollToIndex(results.length - 1, { align: "end" });
  }, [results.length]);

  const handleSubmit = () => {
    shouldStickToBottomRef.current = true;
  };

  const handleScroll = (offset: number) => {
    if (!listRef.current) return;

    shouldStickToBottomRef.current =
      offset - listRef.current.scrollSize + listRef.current.viewportSize >=
      // FIXME: The sum may not be 0 because of sub-pixel value when browser's window.devicePixelRatio has decimal value
      -1.5;

    if (offset < 100) {
      isPrependRef.current = true;
      loadMore(10);
    }
  };

  return (
    <div className="flex size-full flex-col">
      <VList
        ref={listRef}
        style={{ flex: 1 }}
        reverse
        shift={isPrependRef.current}
        onScroll={handleScroll}
      >
        {status === "LoadingFirstPage" && (
          <div className="grid grid-cols-1 gap-1 px-4">
            <ChatLoader length={20} />
          </div>
        )}
        {results
          .map((result) => <ChatContent message={result} key={result._id} />)
          .reverse()}
      </VList>
      <ChatInput chatId={chatId} goingTobotom={handleSubmit} />
    </div>
  );
});

ChatBody.displayName = "ChatBody";
export default ChatBody;
