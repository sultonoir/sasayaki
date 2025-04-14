import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation } from "./message_trigger";
import {
  attachmentSchema,
  createAttachment,
} from "../attachment/attachment_service";
import { mustGetCurrentUser } from "../user/user_service";
import { getAccessUpdate } from "../access/access_service";
import { stream } from "convex-helpers/server/stream";
import schema from "../schema";
import { getMemberUsername } from "../member/member_service";

/**
 * get message paginations
 */

export const getMessages = query({
  args: {
    channelId: v.string(),
    serverId: v.optional(v.id("server")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { channelId, paginationOpts, serverId }) => {
    const session = await mustGetCurrentUser(ctx);
    const haveAccess = await getAccessUpdate(ctx, channelId);
    const messages = stream(ctx.db, schema)
      .query("message")
      .withIndex("by_message_channel", (q) => q.eq("channelId", channelId))
      .order("desc")
      .map(async (message) => {
        const user = await ctx.db.get(message.userId);
        const member = await getMemberUsername(ctx, message.userId, serverId);

        if (!user) {
          return null;
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

        const profile = await getOneFrom(
          ctx.db,
          "userImage",
          "by_user_image",
          user._id,
          "userId",
        );

        return {
          ...message,
          user: {
            ...user,
            name: member || user.name,
          },
          parent,
          attachment,
          access,
          profile,
        };
      });

    return messages.paginate(paginationOpts);
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

  const profile = await getOneFrom(
    ctx.db,
    "userImage",
    "by_user_image",
    user._id,
    "userId",
  );

  return {
    ...message,
    user,
    attachment,
    profile,
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
  args: {
    id: v.id("message"),
    attachments: v.optional(v.array(v.id("attachment"))),
  },
  handler: async (ctx, { id, attachments }) => {
    await ctx.db.delete(id);

    if (attachments) {
      for (const atc of attachments) {
        await ctx.db.delete(atc);
      }
    }
  },
});
