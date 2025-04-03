import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { asyncMap } from "convex-helpers";
import { mutation } from "./message_trigger";
import {
  attachmentSchema,
  createAttachment,
} from "../attachment/attachment_service";
import { mustGetCurrentUser } from "../user/user_service";

export const getLastMessage = async ({
  ctx,
  chatId,
}: {
  ctx: QueryCtx;
  chatId: Id<"chat">;
}) => {
  const message = await ctx.db
    .query("message")
    .withIndex("by_chat_time", (q) => q.eq("chatId", chatId))
    .order("desc")
    .first();

  if (!message) {
    return {
      lastMessage: "Group created",
      lastMessageTime: 0,
    };
  }

  const sender = await ctx.db.get(message.userId);

  if (!sender?.username) {
    return {
      lastMessage: message.body,
      lastMessageTime: message._creationTime, // Pastikan tetap ada timestamp
    };
  }

  const attachment = await ctx.db
    .query("attachment")
    .withIndex("by_attachment_messageid", (q) => q.eq("messageId", message._id))
    .order("desc")
    .first();

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

/**
 * get message paginations
 */

export const getMessages = query({
  args: { chatId: v.id("chat"), paginationOpts: paginationOptsValidator },
  handler: async (ctx, { chatId, paginationOpts }) => {
    const messages = await ctx.db
      .query("message")
      .withIndex("by_chat_time", (q) => q.eq("chatId", chatId))
      .order("desc")
      .paginate(paginationOpts);

    const newMessages = await asyncMap(messages.page, async (message) => {
      const user = await ctx.db.get(message.userId);

      if (!user) {
        throw new ConvexError("user not found");
      }

      const child = await getChildMessage({ ctx, parentId: message.parentId });

      const attachment = await getManyFrom(
        ctx.db,
        "attachment",
        "by_attachment_messageid",
        message._id,
        "messageId",
      );

      return {
        ...message,
        user,
        child,
        attachment,
      };
    });

    return {
      ...messages,
      page: newMessages,
    };
  },
});

/**
 * helper get child message
 */

async function getChildMessage({
  ctx,
  parentId,
}: {
  ctx: QueryCtx;
  parentId?: Id<"message">;
}) {
  if (!parentId) return null;
  const message = await getOneFrom(ctx.db, "message", "by_id", parentId, "_id");

  if (!message) return null;

  const user = await getOneFrom(
    ctx.db,
    "users",
    "by_id",
    message.userId,
    "_id",
  );

  if (!user) return null;

  const attachment = await getManyFrom(
    ctx.db,
    "attachment",
    "by_attachment_messageid",
    message._id,
    "messageId",
  );

  return {
    ...message,
    user,
    attachment,
  };
}

/**
 * send message
 */

export const sendMessage = mutation({
  args: {
    chatId: v.id("chat"),
    parentId: v.optional(v.id("message")),
    body: v.optional(v.string()),
    attachments: v.optional(attachmentSchema),
  },
  handler: async (ctx, { chatId, body, attachments, parentId }) => {
    const user = await mustGetCurrentUser(ctx);
    const member = await ctx.db
      .query("member")
      .withIndex("by_user_member", (q) =>
        q.eq("userId", user._id).eq("chatId", chatId),
      )
      .first();
    if (!member) {
      throw new ConvexError("You are not part of this group");
    }
    const messageId = await ctx.db.insert("message", {
      body,
      chatId,
      userId: user._id,
      parentId,
      sentAt: Date.now(),
    });

    if (attachments && attachments.length > 0) {
      await createAttachment({ ctx, values: attachments, messageId });
    }
  },
});
