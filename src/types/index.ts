import { type Socket, type Server as NetServer } from "net";
import { type Server as SocketIOServer } from "socket.io";
import { type NextApiResponse } from "next";
import { type Media, type Thread as Post, type User } from "@prisma/client";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type LikeInitialData = {
  count: number;
  isUserLike: boolean;
};

export type RepostInitialData = {
  count: number;
  isUserRepost: boolean;
};

export type Thread = Post & {
  user: {
    username: string;
    name: string;
    image: string | null;
  };
  media: Media[];
  like: LikeInitialData;
  comment: number;
  repost: RepostInitialData;
  isBookmarked: boolean;
};

export type ThreadPage = {
  posts: Post[];
  nextCursor: string | null;
};

export type ThreadWs = {
  id: string;
  like: number;
  comment: number;
  repost: number;
};
