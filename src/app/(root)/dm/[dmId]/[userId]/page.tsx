import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { capitalizeWords } from "@/lib/capitalize";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import DmLayout from "@/components/dm/dm-layout";

type Params = Promise<{ dmId: string; userId: Id<"users"> }>;
interface Props {
  params: Params;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { userId } = await props.params;

  const serverName = await fetchQuery(
    api.user.user_service.getUserByid,
    {
      id: userId,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );

  return {
    title: capitalizeWords(serverName?.name || "sasayaki"),
  };
}

const Page = async ({ params }: Props) => {
  const { userId,dmId } = await params;
  const user = await fetchQuery(
    api.user.user_service.getUserByid,
    {
      id: userId,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );

  if (!user) return notFound();

  return <DmLayout user={user} chanelId={dmId} />;
};

export default Page;
