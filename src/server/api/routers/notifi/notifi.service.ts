import type * as input from "./notifi.input";
import { db } from "@/server/db";
import { createId } from "@/helper/createId";
import { TRPCError } from "@trpc/server";

export const createNotification = async (
  notificationData: input.CreateNotification,
) => {
  const notification = await db.notification.create({
    data: {
      id: createId(10),
      ...notificationData,
    },
  });

  if (!notification) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "通知の作成に失敗しました",
    });
  }
  return notification;
};

export const getNotificationCount = async ({
  recipientId,
}: input.GetNotificationsCount) => {
  const count = await db.notification.count({
    where: {
      recipientId,
      read: false,
    },
  });

  return {
    count,
    recipientId,
  };
};
