"use client";

import { env } from "@/env";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io as ClientIO, type Socket } from "socket.io-client";
import { useSession } from "./session-provider";
import { api } from "@/trpc/react";
import { type ThreadWs, type CommentWithUser } from "@/types";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  threads: ThreadWs[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  threads: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const utils = api.useUtils();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [threads, setThreads] = useState<ThreadWs[]>([]);

  useEffect(() => {
    const socketInstance: Socket = ClientIO(env.NEXT_PUBLIC_APP_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.emit("user", user?.id);
    socketInstance.on("comment", async (data: CommentWithUser) => {
      await utils.comment.getComment.cancel();
      utils.comment.getComment.setInfiniteData(
        { id: data.threadId },
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [...firstPage.comments, data],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }

          return oldData;
        },
      );
    });

    socketInstance.on("thread-update", (newThread: ThreadWs) => {
      setThreads((prev) => {
        const updatedThreads = prev.map((thread) =>
          thread.id === newThread.id
            ? {
                ...thread, // Tetap menggunakan data thread yang ada
                like: newThread.like ?? thread.like, // Update `like` jika ada
                comment: newThread.comment ?? thread.comment, // Update `comment` jika ada
                repost: newThread.repost ?? thread.repost, // Update `repost` jika ada
              }
            : thread,
        );

        const isExisting = prev.some((thread) => thread.id === newThread.id);

        return isExisting ? updatedThreads : [...prev, newThread];
      });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, utils.comment.getComment]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, threads }}>
      {children}
    </SocketContext.Provider>
  );
};
