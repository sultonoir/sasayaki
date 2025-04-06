import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { getLastMessage } from "../message/message_service";
import { messageAggregate } from "../message/message_aggregate";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";

export const createGroup = mutation({
  args: { name: v.string(), image: v.string() },
  handler: async (ctx, { name, image }) => {
    const user = await mustGetCurrentUser(ctx);
    const chatId = await ctx.db.insert("chat", {
      name,
      image,
      createdAt: Date.now(),
      code: Date.now().toString(),
      isGroup: true,
    });

    await ctx.db.insert("member", {
      userId: user._id,
      chatId,
      joinedAt: 0,
      role: "admin",
    });
    return { success: true };
  },
});

/**
 * get chat list from current user
 * @private
 * u need login to get this
 */

/**
 * helper check chat
 */

export async function getChat({
  ctx,
  chatId,
}: {
  ctx: QueryCtx;
  chatId: Id<"chat">;
}) {
  const user = await mustGetCurrentUser(ctx);
  const junk = await ctx.db
    .query("junk")
    .withIndex("by_junk_user", (q) =>
      q.eq("chatId", chatId).eq("userId", user._id),
    )
    .unique();

  if (!junk) {
    return await ctx.db
      .query("chat")
      .withIndex("by_id", (q) => q.eq("_id", chatId))
      .first();
  }

  return await ctx.db
    .query("chat")
    .withIndex("by_id", (q) => q.eq("_id", chatId))
    .filter((q) => q.not(q.eq(q.field("_id"), junk.chatId)))
    .first();
}

export const chatlists = query({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);
    const members = await getManyFrom(
      ctx.db,
      "member",
      "by_member_userid",
      user._id,
      "userId",
    );

    const results = await asyncMap(members, async (member) => {
      const other = await ctx.db
        .query("member")
        .withIndex("by_member_chatid", (q) => q.eq("chatId", member.chatId))
        .filter((q) => q.not(q.eq(q.field("userId"), user._id)))
        .first();

      const getRead = await ctx.db
        .query("read")
        .withIndex("by_read_user_chat", (q) =>
          q.eq("userId", user._id).eq("chatId", member.chatId),
        )
        .first();

      const chat = await getChat({ ctx, chatId: member.chatId });

      const { lastMessage, lastMessageTime } = await getLastMessage({
        ctx,
        chatId: member.chatId,
      });

      // Hitung jumlah pesan yang belum dibaca
      let notReadCount = 0;

      if (getRead) {
        // Hitung pesan yang masuk setelah waktu terakhir dibaca
        notReadCount = await messageAggregate.count(ctx, {
          namespace: member.chatId,
          bounds: {
            lower: { key: getRead._creationTime, inclusive: true }, // Waktu terakhir dibaca
            upper: undefined,
          },
        });
      } else {
        // Jika tidak ada catatan read, semua pesan dianggap belum dibaca
        notReadCount = await messageAggregate.count(ctx, {
          namespace: member.chatId,
          bounds: {
            lower: undefined,
            upper: undefined,
          },
        });
      }

      if (other && chat?.isGroup === false) {
        const otherMember = await ctx.db.get(other.userId);
        return {
          _id: member.chatId,
          name: otherMember?.username || "unknown name",
          image:
            otherMember?.image ||
            "https://res.cloudinary.com/dv6cln4gs/image/upload/v1743506282/group/ri6jpgw5ayrk4aajjxfc.png",
          lastMessage,
          lastMessageTime:
            lastMessageTime === 0 ? member._creationTime : lastMessageTime,
          notread: notReadCount, // Tambahkan properti notread
        };
      }

      return {
        _id: member.chatId,
        name: chat?.name || "unknown name",
        image:
          chat?.image ||
          "https://res.cloudinary.com/dv6cln4gs/image/upload/v1743506282/group/ri6jpgw5ayrk4aajjxfc.png",
        lastMessage,
        lastMessageTime:
          lastMessageTime === 0 ? member._creationTime : lastMessageTime,
        notread: notReadCount, // Tambahkan properti notread
      };
    });

    return results;
  },
});

/**
 * helper for get chat
 * @param
 * id : Id<"chat">
 */

export const getChatMetadata = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx;
  id: Id<"chat">;
}) => {
  const user = await mustGetCurrentUser(ctx);
  const chat = await getOneFrom(ctx.db, "chat", "by_id", id, "_id");

  if (!chat) {
    return null;
  }

  const member = await ctx.db
    .query("member")
    .withIndex("by_member_chatid", (q) => q.eq("chatId", chat._id))
    .filter((q) => q.not(q.eq(q.field("userId"), user._id)))
    .first();

  if (member && chat.isGroup === false) {
    const userOther = await ctx.db.get(member.userId);
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", member.userId))
      .first();
    return {
      ...chat,
      name: userOther?.username || "unknown user",
      image:
        userOther?.image ||
        "https://res.cloudinary.com/dv6cln4gs/image/upload/v1743506282/group/ri6jpgw5ayrk4aajjxfc.png",
      online: presence?.isOnline || false,
      lastSeen: presence?.lastSeen || 0,
    };
  }
  return {
    ...chat,
    online: false,
    lastSeen: 0,
  };
};

/**
 * get chat with member
 */

export const getChatByIdWithMembers = query({
  args: { id: v.id("chat") },
  handler: async (ctx, { id }) => {
    const chat = await getChatMetadata({ ctx, id });

    if (!chat) {
      return null;
    }
    const members = await getManyFrom(
      ctx.db,
      "member",
      "by_member_chatid",
      id,
      "chatId",
    );

    const newMembers = await asyncMap(members, async (member) => {
      const presence = await ctx.db
        .query("presence")
        .withIndex("by_user", (q) => q.eq("userId", member.userId))
        .first();

      const user = await ctx.db.get(member.userId);

      return {
        ...member,
        online: presence?.isOnline || false,
        username: user?.username || "unknown name",
        image:
          user?.image ||
          "https://res.cloudinary.com/dv6cln4gs/image/upload/v1743506282/group/ri6jpgw5ayrk4aajjxfc.png",
      };
    });

    return {
      ...chat,
      members: newMembers,
    };
  },
});

/**
 * get chat metada nextjs
 */

export const getChatById = query({
  args: { id: v.id("chat") },
  handler: async (ctx, { id }) => {
    return await getChatMetadata({ ctx, id });
  },
});

/**
 *  send personal message
 * @param other : Id<'users'> for user u want to send personal message
 */

export const createDm = mutation({
  args: { other: v.id("users"), message: v.string() },
  handler: async (ctx, { other, message }) => {
    const user = await mustGetCurrentUser(ctx);
    const chatId = await findDm({ ctx, other });

    await ctx.db.insert("message", {
      body: message,
      userId: user._id,
      chatId,
      sentAt: Date.now(),
    });
  },
});

/**
 *  helper for find personal message
 */

export async function findDm({
  ctx,
  other,
}: {
  ctx: MutationCtx;
  other: Id<"users">;
}) {
  const user = await mustGetCurrentUser(ctx);

  const members = await ctx.db
    .query("member")
    .withIndex("by_member_userid", (q) => q.eq("userId", user._id))
    .collect();

  let chatId: Id<"chat"> | null = null;

  for (const member of members) {
    const chatMembers = await ctx.db
      .query("member")
      .withIndex("by_member_chatid", (q) => q.eq("chatId", member.chatId))
      .collect();

    // find chating
    const chat = await ctx.db.get(member.chatId);
    // Check if user B is one of the members
    const hasBothUsers = chatMembers.some((member) => member.userId === other);

    if (chatMembers.length === 2 && hasBothUsers && chat?.isGroup === false) {
      chatId = member.chatId;
    }
  }

  if (!chatId) {
    const dm = await ctx.db.insert("chat", {
      name: "",
      image: "",
      createdAt: Date.now(),
      code: "",
      isGroup: false,
    });

    const newMembers = [
      {
        userId: user._id,
        chatId: dm,
        role: "",
      },
      {
        userId: other,
        chatId: dm,
        role: "",
      },
    ];
    await ctx.scheduler.runAfter(
      0,
      internal.member.member_service.createMember,
      {
        members: newMembers,
      },
    );

    return dm;
  }

  return chatId;
}
