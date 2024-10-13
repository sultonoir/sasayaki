import React from "react";
import { SessionProvider } from "./session-provider";
import { verifySession } from "@/helper/session";
import { CommentDialog } from "@/components/templates/comment/comment-dialog";
import { SocketProvider } from "./socket-provider";
import { ThreadProvider } from "./thread-provider";

const Provider = async ({ children }: { children: React.ReactNode }) => {
  const session = await verifySession();
  return (
    <React.Fragment>
      <SessionProvider session={session}>
        <SocketProvider>
          <ThreadProvider>
            {children}
            <CommentDialog />
          </ThreadProvider>
        </SocketProvider>
      </SessionProvider>
    </React.Fragment>
  );
};

export default Provider;
