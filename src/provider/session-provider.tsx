"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useSession } from "@/hooks/use-session";
import * as React from "react";

interface SessionProviderProps {
  user: Doc<"users"> | null;
  children: React.ReactNode;
}

const SessionProvider = ({ user, children }: SessionProviderProps) => {
  const {setSession} = useSession()
  React.useEffect(() => {
    if (!user) return;

    // Kirim status online saat page load
    setSession(user)
    fetch("/api/user-online", {
      method: "POST",
      body: JSON.stringify({ userId: user._id, timestamp: Date.now() }),
      headers: { "Content-Type": "application/json" },
    });

    // Kirim status offline saat page ditutup
    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        "/api/user-offline",
        JSON.stringify({ userId: user._id, timestamp: Date.now() }),
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [setSession, user]);

  return <>{children}</>;
};

export default SessionProvider;
