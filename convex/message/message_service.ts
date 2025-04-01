import { getOneFrom } from "convex-helpers/server/relationships";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export const getLastMessage = async ({
  ctx,
  chatId,
}: {
  ctx: QueryCtx;
  chatId: Id<"chat">;
}) => {
  const message = await getOneFrom(
    ctx.db,
    "message",
    "by_chat_time",
    chatId,
    "chatId",
  );

  if (!message?.body) {
    return {
      lastMessage: "Group created",
      lastMessageTime: 0,
    };
  }

  const sender = await ctx.db.get(message.userId);

  if (!sender?.username) {
    return {
      lastMessage: "",
      lastMessageTime: message._creationTime, // Pastikan tetap ada timestamp
    };
  }

  const attachment = await getOneFrom(
    ctx.db,
    "attachment",
    "by_attachment_messageid",
    message._id,
    "messageId",
  );

  if (attachment) {
    return {
      lastMessage: `${sender.username} : ${generateFormat(attachment.format)}`,
      lastMessageTime: attachment._creationTime,
    };
  }

  return {
    lastMessage: `${sender.username} : ${message.body}`,
    lastMessageTime: message._creationTime,
  };
};

function generateFormat(format: string) {
  switch (format) {
    case "image":
      return "sending image";
    case "video":
      return "sending video";
    case "raw":
      return "sending files";
    case "auto":
      return "sending file";
    default:
      return "unknown format";
  }
}
