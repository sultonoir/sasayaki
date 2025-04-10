import { PageLayout } from "@/components/ui/page-layouting";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import React from "react";
import SessionProvider from "@/provider/session-provider";
import DialogProvider from "@/provider/dialog-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchQuery(
    api.user.user_service.getSession,
    {},
    {
      token: await convexAuthNextjsToken(),
    },
  );
  return (
    <SessionProvider user={user}>
      <TooltipProvider delayDuration={0}>
        <PageLayout>{children}</PageLayout>
        <Toaster richColors position="top-center" />
      </TooltipProvider>
      <DialogProvider />
    </SessionProvider>
  );
}
