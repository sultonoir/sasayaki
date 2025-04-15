import FieldToast from "@/components/form/user/field-toast";
import { SidebarApp } from "@/components/sidebar/sidebar-app";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import DialogProvider from "@/provider/dialog-provider";
import { ProfileEditProvider } from "@/provider/profile-edit-provider";
import { SessionProvider } from "@/provider/session-provider";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import React from "react";

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
      <ProfileEditProvider user={user}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "370px",
            } as React.CSSProperties
          }
        >
          <SidebarApp />
          <SidebarInset className="overflow-x-hidden">
            <div className="bg-card m-2 flex flex-1 flex-col overflow-hidden rounded-xl border pt-0">
              {children}
            </div>
            <FieldToast />
          </SidebarInset>
        </SidebarProvider>
        <DialogProvider />
      </ProfileEditProvider>
    </SessionProvider>
  );
}
