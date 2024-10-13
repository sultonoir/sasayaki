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
import { type CommentWithUser } from "@/types";
import { type Todos } from "@prisma/client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const utils = api.useUtils();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance: Socket = ClientIO(env.NEXT_PUBLIC_APP_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.emit("user", user?.id);
    socketInstance.on("comment", async (newComment: CommentWithUser) => {
      await utils.comment.getComment.cancel();
      utils.comment.getComment.setInfiniteData(
        {
          id: newComment.id,
        },
        (data) => {
          if (!data) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              comments: [...page.comments, newComment],
            })),
          };
        },
      );
    });

    socketInstance.on("todo", (todo: Todos) => {
      utils.todo.getAllTodo.setData(undefined, (oldData) => {
        if (!oldData) {
          return [todo];
        }
        const isExisting = oldData.some((item) => item.id === todo.id);
        const updateTodo = isExisting
          ? oldData.map((item) => (item.id === todo.id ? todo : item))
          : [...oldData, todo];
        return updateTodo;
      });
    });

    socketInstance.on("deleteTodo", (todo: Todos) => {
      utils.todo.getAllTodo.setData(undefined, (oldData) => {
        if (!oldData) {
          return oldData; // If there are no existing todos, return an empty array
        }
        // Filter out the deleted todo based on the provided id
        const updatedTodos = oldData.filter((item) => item.id !== todo.id);
        return updatedTodos; // Return the updated list of todos
      });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, utils.comment.getComment, utils.todo.getAllTodo]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
