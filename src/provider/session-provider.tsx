"use client";

import { api } from "@/convex/_generated/api";
import { Session } from "@/types";
import { useQuery } from "convex-helpers/react";
import { createContext, useContext, useEffect } from "react";

interface SessionProviderProps {
  user: Session | null;
}

const SessionContext = createContext<SessionProviderProps | undefined>(
  undefined,
);

// Hook untuk track presence
const useUserPresence = (userId: string | null) => {
  useEffect(() => {
    if (!userId) return;

    // Kirim status online saat page load
    fetch("/api/user-online", {
      method: "POST",
      body: JSON.stringify({ userId, timestamp: Date.now() }),
      headers: { "Content-Type": "application/json" },
    });

    // Kirim status offline saat page ditutup
    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        "/api/user-offline",
        JSON.stringify({ userId, timestamp: Date.now() }),
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [userId]);
};

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Panggil hook walaupun user null (biar nggak conditional)
  const { data } = useQuery(api.user.user_service.getSession);
  useUserPresence(data?._id ?? null);

  // Kalau user null, jangan render apa-apa

  return (
    <SessionContext.Provider value={{ user: data || null }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
