import { v } from "convex/values";
import { mutation, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { Id } from "../_generated/dataModel";
import { getOneFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";

export const addFriend = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, { friendId }) => {
    const user = await mustGetCurrentUser(ctx);

    const isFriend = await getIsFriend(ctx, friendId);
    if (!isFriend) {
      return await ctx.db.insert("friend", { ownerId: user._id, friendId });
    }
    await ctx.db.delete(isFriend._id);
  },
});

export async function getIsFriend(ctx: QueryCtx, friendId: Id<"users">) {
  const user = await mustGetCurrentUser(ctx);
  const friend = await ctx.db
    .query("friend")
    .withIndex("by_friend", (q) =>
      q.eq("ownerId", user._id).eq("friendId", friendId),
    )
    .unique();

  return friend;
}

export async function getMutualFriends(
  ctx: QueryCtx,
  userA: Id<"users">,
  userB: Id<"users">,
) {
  // Get all friends of user A
  const friendsOfA = await ctx.db
    .query("friend")
    .withIndex("by_friend_owner", (q) => q.eq("ownerId", userA))
    .collect();

  // Get all friends of user B
  const friendsOfB = await ctx.db
    .query("friend")
    .withIndex("by_friend_owner", (q) => q.eq("ownerId", userB))
    .collect();

  // Extract just the friendIds
  const friendIdsOfA = friendsOfA.map((f) => f.friendId);
  const friendIdsOfB = friendsOfB.map((f) => f.friendId);

  // Find common friendIds
  const commonFriendIds = friendIdsOfA.filter((id) =>
    friendIdsOfB.includes(id),
  );

  // Optionally, fetch the actual user documents for these common friends
  const commonFriends = await asyncMap(commonFriendIds, async (f) => {
    const user = await ctx.db.get(f);
    if (!user) return null;
    const profile = await getOneFrom(
      ctx.db,
      "userImage",
      "by_user_image",
      f,
      "userId",
    );
    return {
      ...user,
      profile,
    };
  });

  return commonFriends.filter((item) => item !== null);
}
