import { getOneFrom } from "convex-helpers/server/relationships";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { CreateBannerSchema } from "./banner_model";

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
  value: Doc<"banner">;
}) {
  const banner = await ctx.db
    .query("banner")
    .withIndex("by_banner_user", (q) =>
      q.eq("userId", value.userId).eq("url", value.url),
    )
    .unique();

  if (!banner) {
    await ctx.db.patch(value._id, value);
  }
}

export async function getBanner({
  ctx,
  userId,
}: {
  ctx: MutationCtx;
  userId: Id<"users">;
}) {
  return getOneFrom(ctx.db,'banner','by_banner_user',userId,'userId')
}
