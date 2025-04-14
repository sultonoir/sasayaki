import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export async function getRoles(
  ctx: QueryCtx,
  userId: Id<"users">,
  serverId?: Id<"server">,
) {
  if (!serverId) return [];

  return await ctx.db
    .query("role")
    .withIndex("by_role_user", (q) =>
      q.eq("userId", userId).eq("serverId", serverId),
    )
    .take(4);
}
