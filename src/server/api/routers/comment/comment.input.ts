import { type NotificationType } from "@prisma/client";
import { z } from "zod";
export const CreateCommetInput = z.object({
  value: z.string(),
  threadId: z.string(),
});

export type GetThread = {
  threadId: string;
};

export type CreateCommetInput = z.infer<typeof CreateCommetInput>;

export type CreateNotification = {
  threadId?: string;
  issuerId: string;
  recipientId: string;
  type: NotificationType;
};

export type GetNorificationsCount = {
  recipientId: string;
};

export const GetCommentInput = z.object({
  id: z.string(),
  cursor: z.string().optional(),
});

export type GetCommentInput = z.infer<typeof GetCommentInput>;
