import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { internalMutation } from "./member_trigger";
import { QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { getManyFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";

export const createMember = internalMutation({
  args: {
    members: v.array(
      v.object({
        chatId: v.id("chat"),
        userId: v.id("users"),
        role: v.string(),
      }),
    ),
  },
  handler: async (ctx, { members }) => {
    for (const member of members) {
      await ctx.db.insert("member", {
        userId: member.userId,
        chatId: member.chatId,
        joinedAt: Date.now(),
        role: member.role,
      });
    }
  },
});

export const autoAddMember = internalMutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    const chatId = "n97ceste3zdjqx8vzttce8ctzh7d7yga" as unknown as Id<"chat">;

    const member = await ctx.db
      .query("member")
      .withIndex("by_user_member", (q) =>
        q.eq("userId", id).eq("chatId", chatId),
      )
      .unique();

    if (!member) {
      await ctx.db.insert("member", {
        userId: id,
        chatId,
        joinedAt: Date.now(),
        role: "member",
      });
    }
  },
});

export async function findGroupMutual({
  ctx,
  other,
}: {
  ctx: QueryCtx;
  other: Id<"users">;
}) {
  const user = await mustGetCurrentUser(ctx);

  const members = await getManyFrom(
    ctx.db,
    "member",
    "by_member_userid",
    user._id,
    "userId",
  );

  const otherMembers = await getManyFrom(
    ctx.db,
    "member",
    "by_member_userid",
    other,
    "userId",
  );

  const bothMembers = members.filter((item) =>
    otherMembers.some((o) => o.chatId === item.chatId),
  );

  const groups = await asyncMap(bothMembers, async (both) => {
    const group = await ctx.db
      .query("chat")
      .withIndex("by_id", (q) => q.eq("_id", both.chatId))
      .filter((q) => q.eq(q.field("isGroup"), true))
      .first();

    return group;
  });

  return groups.filter((group) => group !== null);
}
