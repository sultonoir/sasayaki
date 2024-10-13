/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Server as NetServer } from "http";
import { Server as ServerIO, type Socket } from "socket.io";
import { type NextApiRequest } from "next";
import {
  type ThreadWs,
  type NextApiResponseServerIo,
  type NotificationCount,
} from "@/types";
import { type Todos } from "@prisma/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });

    io.on("connection", (socket: Socket) => {
      console.log("A user connected:", socket.id);

      socket.on("user", (fileId: string) => {
        console.log(`User joined room: ${fileId}`);
        void socket.join(fileId); // Join room with fileId
      });

      // Menerima pesan dari client dan broadcast ke room yang sesuai
      socket.on(
        "chat message",
        ({ id, message }: { id: string; message: string }) => {
          console.log(`Message from ${id}: ${message}`);
          // io.to(id).emit("chat message", message); // Broadcast ke semua user di room
        },
      );

      socket.on("comment", (data) => {
        io.emit("comment", data);
      });

      socket.on("todo", (todo: Todos) => {
        io.emit("todo", todo);
      });

      socket.on("deleteTodo", (todo: Todos) => {
        io.emit("deleteTodo", todo);
      });

      socket.on("thread-update", (thread: ThreadWs) => {
        console.log("Received thread update:", thread);
        io.emit("thread-update", thread);
      });

      socket.on("notification-count", (data: NotificationCount) => {
        io.to(data.recipientId).emit("notification-count", data);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
