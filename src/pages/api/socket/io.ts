/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Server as NetServer } from "http";
import { Server as ServerIO, type Socket } from "socket.io";
import { type NextApiRequest } from "next";
import { type NextApiResponseServerIo } from "@/types";

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

      // Menerima pesan dari client
      socket.on("chat message", (msg: string) => {
        console.log("Message received:", msg);

        // Broadcast pesan kembali ke semua client
        io.emit("chat message", msg);
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
