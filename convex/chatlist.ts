import { Infer, v } from "convex/values";
import { query } from "./_generated/server";
import { mustGetCurrentUser } from "./user/user_service";
import { getAll } from "convex-helpers/server/relationships";

export const Chatlists = v.array(
  v.object({
    _id: v.union(v.id("group"), v.id("directChat")),
    type: v.string(),
    name: v.string(),
    avatarUrlId: v.string(),
    lastMessage: v.string(),
    lastMessageTime: v.number(),
  }),
);

export const listChats = query({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);
    const userId = user._id;

    // Fetch all direct chats for this user
    const directChats = await ctx.db
      .query("directChat")
      .withIndex("by_participants", (q) => q.eq("from", userId))
      .collect();

    // Fetch all group chats this user is a member of
    const groupMemberships = await ctx.db
      .query("member")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const groupChatIds = groupMemberships.map(
      (membership) => membership.groupId,
    );

    // Fetch the actual group chat details
    const groupChats = await getAll(ctx.db, groupChatIds);

    // Process direct chats to show the other participant's info
    const processedDirectChats = await Promise.all(
      directChats.map(async (chat) => {
        // Find the other user's ID (not the current user)
        const otherUserId = chat.from === userId ? chat.from : chat.to;

        // Get the other user's details
        const otherUser = await ctx.db.get(otherUserId);

        // Get the latest message
        const latestMessages = await ctx.db
          .query("directMessage")
          .withIndex("by_chat_time", (q) => q.eq("chatId", chat._id))
          .order("desc")
          .take(1);

        const latestMessage =
          latestMessages.length > 0 ? latestMessages[0] : null;

        return {
          _id: chat._id,
          type: "direct",
          name: otherUser?.name || "Unknown User",
          avatarUrlId: otherUser?.image || "/avatar.png",
          lastMessage: latestMessage?.body || "",
          lastMessageTime: latestMessage?.sentAt || Date.now(),
        };
      }),
    );

    // Process group chats
    const processedGroupChats = await Promise.all(
      groupChats
        .map(async (chat) => {
          if (!chat) return null;

          // Get the latest message
          const latestMessages = await ctx.db
            .query("groupMessage")
            .withIndex("by_chat_time", (q) => q.eq("chatId", chat._id))
            .order("desc")
            .take(1);

          const latestMessage =
            latestMessages.length > 0 ? latestMessages[0] : null;

          return {
            _id: chat._id,
            type: "group",
            name: chat.name,
            avatarUrlId: chat.image,
            lastMessage: latestMessage?.body || "",
            lastMessageTime: latestMessage?.sentAt || Date.now(),
          };
        })
        .filter((item) => item !== null),
    );

    // Combine and sort all chats by latest message time
    const allChats = [
      ...processedDirectChats,
      ...processedGroupChats.filter((item) => item !== null),
    ].sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));

    return allChats;
  },
  returns: Chatlists,
});

export type Chatlists = Infer<typeof Chatlists>;
