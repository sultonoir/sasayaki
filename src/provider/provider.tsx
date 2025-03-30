"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import SessionProvider from "./session-provider";
import { ThemeProvider } from "./theme-provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange>
        {children}
      </ThemeProvider>
      <SessionProvider />
    </ConvexAuthNextjsProvider>
  );
}
