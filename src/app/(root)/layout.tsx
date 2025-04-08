import {PageLayout} from "@/components/ui/page-layouting";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SessionProvider from "@/provider/session-provider";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <PageLayout>{children}</PageLayout>
      <SessionProvider />
      <Toaster richColors position="top-center" />
    </TooltipProvider>
  );
}
