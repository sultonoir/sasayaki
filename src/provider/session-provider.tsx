"use client";

import { type SessionPayload } from "@/helper/session";
import { createContext, useContext } from "react";

interface SessionProviderProps {
  user: SessionPayload | null;
}

const SessionContext = createContext<SessionProviderProps>({ user: null });

export const SessionProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionPayload | null;
}) => {
  return (
    <SessionContext.Provider value={{ user: session }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return sessionContext;
};
