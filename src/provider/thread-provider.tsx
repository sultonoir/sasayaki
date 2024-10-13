"use client";

import { type ThreadWs } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useSocket } from "./socket-provider";

// Define the context interface
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

  useEffect(() => {
    // Check for socket connection and listen for updates
    if (isConnected && socket) {
      const handleThreadUpdate = (newThread: ThreadWs) => {
        setThreads((prev) => {
          const updatedThreads = prev.map((thread) =>
            thread.id === newThread.id
              ? {
                  ...thread,
                  like: newThread.like ?? thread.like,
                  comment: newThread.comment ?? thread.comment,
                  repost: newThread.repost ?? thread.repost,
                }
              : thread,
          );

          // Add new thread if it doesn't already exist
          return prev.some((thread) => thread.id === newThread.id)
            ? updatedThreads
            : [...updatedThreads, newThread];
        });
      };

      // Subscribe to the thread-update event
      socket.on("thread-update", handleThreadUpdate);

      // Clean up the listener on unmount
      return () => {
        socket.off("thread-update", handleThreadUpdate);
      };
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
  if (!context) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
};
