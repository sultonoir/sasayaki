import { z } from "zod";
import {
  type Bookmark,
  type Comment,
  type Like,
  type Media,
  type Repost,
  type Thread,
} from "@prisma/client";

export const GetThreadInput = z.object({
  limit: z.number().min(1).max(100),
  cursor: z.string().nullish(),
});

export type GetThreadInput = z.infer<typeof GetThreadInput>;

export type FormatResult = Thread & {
  comment: Comment[];
  like: Like[];
  repost: Repost[];
  media: Media[];
  bookmark: Bookmark[];
  user: {
    name: string;
    username: string;
    image: string | null;
  };
};

export const CreateThreadInput = z.object({
  content: z.string().min(1).max(140),
  Media: z.array(z.string()).min(1).max(4),
});

export type CreateThreadInput = z.infer<typeof CreateThreadInput>;

export type CreateThreadMediaInput = {
  id: string;
  media: string[];
  userId: string;
};

export const GetSingleThreadInput = z.object({
  id: z.string(),
});

export type GetSingleThreadInput = z.infer<typeof GetSingleThreadInput>;

export const DeleteThreadInput = z.object({
  id: z.string(),
});

export type DeleteThreadInput = z.infer<typeof DeleteThreadInput>;
