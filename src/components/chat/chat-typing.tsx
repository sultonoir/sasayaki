import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import React from "react";

const ChatTyping = ({ roomid }: { roomid: string }) => {
  const { data } = useQuery(api.typing.typing_service.getTyping, {
    chatId: roomid,
  });
  return <div className="p-2">{data}</div>;
};

export default ChatTyping;
