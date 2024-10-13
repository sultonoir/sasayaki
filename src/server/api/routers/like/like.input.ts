import { z } from "zod";

export const LikeThreadInput = z.object({
  threadId: z.string(),
});

export type LikeThreadInput = {
  threadId: string;
};

export type GetAllLikesInput = {
  userId: string;
};

export type FormatLikeResponse = {
  userId: string;
  threadId: string;
};
