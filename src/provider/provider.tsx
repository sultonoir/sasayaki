import React from "react";
import { SessionProvider } from "./session-provider";
import { verifySession } from "@/helper/session";

const Provider = async ({ children }: { children: React.ReactNode }) => {
  const session = await verifySession();
  return (
    <React.Fragment>
      <SessionProvider session={session}>{children}</SessionProvider>
    </React.Fragment>
  );
};

export default Provider;
