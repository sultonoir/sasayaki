import { Toaster } from "@/components/ui/sonner";
import { api } from "@/convex/_generated/api";
import { SessionProvider } from "@/provider/session-provider";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import React from "react";

const LayoutSetting = async ({ children }: { children: React.ReactNode }) => {
  const user = await fetchQuery(
    api.user.user_service.getSession,
    {},
    {
      token: await convexAuthNextjsToken(),
    },
  );
  return (
    <SessionProvider user={user}>
      {children}
      <Toaster position="top-center" richColors />
    </SessionProvider>
  );
};

export default LayoutSetting;
