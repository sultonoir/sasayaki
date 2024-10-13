import { type NotificationType } from "@prisma/client";

export type GetNotificationsCount = {
  recipientId: string;
};
export type CreateNotification = {
  threadId?: string;
  issuerId: string;
  recipientId: string;
  type: NotificationType;
};
