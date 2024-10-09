import { type Socket, type Server as NetServer } from "net";
import { type Server as SocketIOServer } from "socket.io";
import { type NextApiResponse } from "next";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
