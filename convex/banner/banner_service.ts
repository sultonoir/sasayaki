import { getOneFrom } from "convex-helpers/server/relationships";
import { Id } from "../_generated/dataModel";
import { mutation, MutationCtx } from "../_generated/server";
import { CreateBannerSchema } from "./banner_model";
import { ConvexError, v } from "convex/values";
import { mustGetCurrentUser } from "../user/user_service";

export async function createBanner({
  ctx,
  value,
}: {
  ctx: MutationCtx;
  value: CreateBannerSchema;
}) {
  return await ctx.db.insert("banner", value);
}

export async function updateBanner({
  ctx,
  value,
}: {
  ctx: MutationCtx;
  value: CreateBannerSchema;
}) {
  const banner = await getOneFrom(
    ctx.db,
    "banner",
    "by_banner_user",
    value.userId,
    "userId",
  );

  if (!banner) {
    return await ctx.db.insert("banner", value);
  }
  await ctx.db.patch(banner._id, value);
}

export async function getBanner({
  ctx,
  userId,
}: {
  ctx: MutationCtx;
  userId: Id<"users">;
}) {
  return getOneFrom(ctx.db, "banner", "by_banner_user", userId, "userId");
}

export const removeBanner = mutation({
  args: { bannerId: v.id("banner") },
  handler: async (ctx, { bannerId }) => {
    const user = await mustGetCurrentUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(bannerId);
  },
});
