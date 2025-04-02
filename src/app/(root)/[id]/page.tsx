import { Metadata } from "next";
import React from "react";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { capitalizeWords } from "@/lib/capitalize";
import ChatLayout from "@/components/chat/chat-layout";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

interface Props {
  params: Promise<{ id: Id<"chat"> }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchQuery(
    api.chat.chat_service.getChatById,
    {
      id,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );

  if (!data) notFound();
  return {
    title: capitalizeWords(data.name ?? ""),
  };
}

const Page = async ({ params }: Props) => {
  const { id } = await params;

  const preload = await preloadQuery(
    api.chat.chat_service.getChatByIdWithMembers,
    {
      id,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );

  return <ChatLayout preload={preload} />;
};

export default Page;
