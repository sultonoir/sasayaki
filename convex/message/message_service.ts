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
import { getAccessUpdate } from "../access/access_service";

/**
 * get message paginations
 */

export const getMessages = query({
  args: { channelId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, { channelId, paginationOpts }) => {
    const session = await mustGetCurrentUser(ctx);
    const messages = await ctx.db
      .query("message")
      .withIndex("by_message_channel", (q) => q.eq("channelId", channelId))
      .order("desc")
      .paginate(paginationOpts);

    const haveAccess = await getAccessUpdate(ctx, channelId);

    const newMessages = await asyncMap(messages.page, async (message) => {
      const user = await ctx.db.get(message.userId);
      const member = await ctx.db
        .query("member")
        .withIndex("by_member_userid", (q) => q.eq("userId", message.userId))
        .first();

      if (!user || !member) {
        throw new ConvexError("user not found");
      }

      const parent = await getParentMessage({
        ctx,
        parentId: message.parentId,
      });

      const attachment = await getManyFrom(
        ctx.db,
        "attachment",
        "by_attachment_messageid",
        message._id,
        "messageId",
      );

      const access =
        message.userId === session._id || haveAccess?.remove || false;

      return {
        ...message,
        user: {
          ...user,
          name: member.username || user.name,
        },
        parent,
        attachment,
        access,
      };
    });

    return {
      ...messages,
      page: newMessages,
    };
  },
});

/**
 * helper get parent message
 */

async function getParentMessage({
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
    channelId: v.string(),
    parentId: v.optional(v.id("message")),
    body: v.optional(v.string()),
    attachments: v.optional(attachmentSchema),
  },
  handler: async (ctx, { channelId, body, attachments, parentId }) => {
    const user = await mustGetCurrentUser(ctx);

    const messageId = await ctx.db.insert("message", {
      body,
      channelId,
      userId: user._id,
      parentId,
      sentAt: Date.now(),
    });

    if (attachments && attachments.length > 0) {
      await createAttachment({ ctx, values: attachments, messageId });
    }
  },
});

export const removeMessage = mutation({
  args: { id: v.id("message") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
