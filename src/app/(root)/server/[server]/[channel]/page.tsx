import { Metadata } from "next";
import React from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import { capitalizeWords } from "@/lib/capitalize";
import ChatLayout from "@/components/chat/chat-layout";

type Params = Promise<{ server: string; channel: string }>;
interface Props {
  params: Params;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { channel } = await props.params;

  const serverName = await fetchQuery(
    api.server.server_service.getServerByChannelId,
    {
      id: channel as unknown as Id<"channel">,
    },
  );

  return {
    title: capitalizeWords(serverName?.name || "sasayaki"),
  };
}

const Page = async (props: Props) => {
  const { channel } = await props.params;

  const serverName = await fetchQuery(
    api.server.server_service.getServerByChannelId,
    {
      id: channel as unknown as Id<"channel">,
    },
  );

  if (!serverName) {
    return notFound();
  }
  return <ChatLayout server={serverName} channelId={channel} />;
};

export default Page;
