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
import { getMemberUsername, getSearchMember } from "../member/member_service";
import { asyncMap } from "convex-helpers";

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
          serverId,
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
  serverId,
}: {
  ctx: QueryCtx;
  parentId?: Id<"message">;
  serverId?: Id<"server">;
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

  const member = await getMemberUsername(ctx, message.userId, serverId);

  return {
    ...message,
    user: {
      ...user,
      name: member || user.name,
    },
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

export const searchMessage = mutation({
  args: {
    body: v.string(),
    channelId: v.string(),
    serverId: v.optional(v.id("server")),
  },
  handler: async (ctx, { body, channelId, serverId }) => {
    const queries = await ctx.db
      .query("message")
      .withSearchIndex("by_message_body", (q) =>
        q.search("body", body).eq("channelId", channelId),
      )
      .collect();

    const messages = await asyncMap(queries, async (q) => {
      const user = await ctx.db.get(q.userId);
      if (!user) {
        return null;
      }
      const parent = await getParentMessage({
        ctx,
        parentId: q.parentId,
      });

      const attachment = await getManyFrom(
        ctx.db,
        "attachment",
        "by_attachment_messageid",
        q._id,
        "messageId",
      );

      const profile = await getOneFrom(
        ctx.db,
        "userImage",
        "by_user_image",
        q.userId,
        "userId",
      );

      const memberUsername = await getMemberUsername(ctx, q.userId, serverId);
      return {
        ...q,
        user: {
          ...user,
          name: memberUsername || user.name,
        },
        parent,
        attachment,
        profile,
        access: false,
      };
    });

    return {
      messages: messages.filter((f) => f !== null),
      members: serverId ? await getSearchMember(ctx, serverId, body) : [],
    };
  },
});
