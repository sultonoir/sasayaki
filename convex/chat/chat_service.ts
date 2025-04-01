import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { getManyFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { getLastMessage } from "../message/message_service";
import { messageAggregate } from "../message/message_aggregate";

export const createGroup = mutation({
  args: { name: v.string(), image: v.string() },
  handler: async (ctx, { name, image }) => {
    const user = await mustGetCurrentUser(ctx);
    const chatId = await ctx.db.insert("chat", {
      name,
      image,
      createdAt: 0,
      code: Date.now().toString(),
      isGroup: false,
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

      const chat = await ctx.db
        .query("chat")
        .withIndex("by_id", (q) => q.eq("_id", member.chatId))
        .first();
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
          image: otherMember?.image || "/avatar.png",
          lastMessage,
          lastMessageTime:
            lastMessageTime === 0 ? member._creationTime : lastMessageTime,
          notread: notReadCount, // Tambahkan properti notread
        };
      }

      return {
        _id: member.chatId,
        name: chat?.name || "unknown name",
        image: chat?.image || "/avatar.png",
        lastMessage,
        lastMessageTime:
          lastMessageTime === 0 ? member._creationTime : lastMessageTime,
        notread: notReadCount, // Tambahkan properti notread
      };
    });

    return results;
  },
});
