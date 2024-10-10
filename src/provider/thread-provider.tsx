"use client";

import { type ThreadWs } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useSocket } from "./socket-provider";

interface ThreadProviderProps {
  threads: ThreadWs[];
}

// Create the context
const ThreadContext = createContext<ThreadProviderProps>({
  threads: [],
});

// Create a provider component
export const ThreadProvider = ({ children }: { children: ReactNode }) => {
  const [threads, setThreads] = useState<ThreadWs[]>([]);

  const { socket, isConnected } = useSocket();
  React.useEffect(() => {
    if (isConnected && socket) {
      socket.on("thread-update", (newThread: ThreadWs) => {
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
    }
  }, [isConnected, socket]);

  return (
    <ThreadContext.Provider value={{ threads }}>
      {children}
    </ThreadContext.Provider>
  );
};

// Custom hook to use the Thread context
export const useThreads = () => {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
};

// export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
//   const { setThreads } = useThreads();
//   useWebSocket(wsURL + "/thread", {
//     onOpen: () => {
//       console.log("open");
//     },
//     onMessage: (event) => {
//       const newThread: ThreadWs = JSON.parse(event.data);
//       setThreads(newThread);
//     },
//     shouldReconnect: () => true,
//   });
//   return <>{children}</>;
// };
