import { api } from "@/convex/_generated/api";
import { capitalizeWords } from "@/lib/capitalize";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import PageClient from "./page-client";
import { Toaster } from "@/components/ui/sonner";
type Params = Promise<{ code: string }>;
interface Props {
  params: Params;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { code } = await props.params;

  const serverName = await fetchQuery(
    api.server.server_service.getServerByCode,
    {
      code,
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
  const { code } = await params;
  const user = await fetchQuery(
    api.user.user_service.getSession,
    {},
    {
      token: await convexAuthNextjsToken(),
    },
  );

  const server = await fetchQuery(
    api.server.server_service.getServerByCode,
    { code },
    { token: await convexAuthNextjsToken() },
  );

  if (!server) return notFound();

  return (
    <>
      <div className="grid h-svh place-items-center">
        <PageClient server={server} user={user} />
      </div>
      <Toaster position="top-center" richColors />
    </>
  );
};

export default Page;
