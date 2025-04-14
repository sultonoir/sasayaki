import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const ChatTyping = () => {
  const pathname = usePathname();
  const { channel, dmId } = useParams<{ channel: string; dmId: string }>();

  const channelId = pathname.startsWith("/server") ? channel : dmId;
  const { data } = useQuery(api.typing.typing_service.getTyping, {
    channelId,
  });
  return <>{data && <div className="p-2 text-xs">{data}</div>}</>;
};

export default ChatTyping;
