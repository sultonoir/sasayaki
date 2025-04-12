import FieldToast from "@/components/form/user/field-toast";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/convex/_generated/api";
import { ProfileEditProvider } from "@/provider/profile-edit-provider";
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
      <ProfileEditProvider user={user}>
        {children}
        <FieldToast />
      </ProfileEditProvider>
      <Toaster position="top-center" richColors />
    </SessionProvider>
  );
};

export default LayoutSetting;
