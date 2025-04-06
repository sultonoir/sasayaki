import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";

/**
 * helper to get chat history from junk
 *  @param chatId : Id<'chat'>
 */

export async function getJunk({
  ctx,
  chatId,
}: {
  ctx: QueryCtx;
  chatId: Id<"chat">;
}) {
  const user = await mustGetCurrentUser(ctx);

  return await ctx.db
    .query("junk")
    .withIndex("by_junk_user", (q) =>
      q.eq("chatId", chatId).eq("userId", user._id),
    )
    .unique();
}

/**
 * helper to restore chat history from junk
 *  @param chatId : Id<'chat'>
 */

export async function restoreFromJunk({
  chatId,
  ctx,
}: {
  ctx: MutationCtx;
  chatId: Id<"chat">;
}) {
  const user = await mustGetCurrentUser(ctx);

  const existing = await ctx.db
    .query("junk")
    .withIndex("by_junk_user", (q) =>
      q.eq("chatId", chatId).eq("userId", user._id),
    )
    .unique();

  if (existing) {
    await ctx.db.delete(existing._id);
  }
}

/**
 * helper to restore chat history from junk
 *  @param chatId : Id<'chat'>
 */

export async function removeChat({
  chatId,
  ctx,
}: {
  ctx: MutationCtx;
  chatId: Id<"chat">;
}) {
  const user = await mustGetCurrentUser(ctx);

  const existing = await ctx.db
    .query("junk")
    .withIndex("by_junk_user", (q) =>
      q.eq("chatId", chatId).eq("userId", user._id),
    )
    .unique();

  if (!existing) {
    return await ctx.db.insert("junk", {
      chatId,
      userId: user._id,
    });
  }

  await ctx.db.patch(existing._id, { _creationTime: Date.now() });
}
