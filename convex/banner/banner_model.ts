import { defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const banner = defineTable({
  format: v.string(),
  fileId: v.string(),
  url: v.string(),
  name: v.string(),
  blur: v.string(),
  userId: v.id("users"),
}).index("by_banner_user", ["userId", "url"]);

export const creatbannerSchema = v.object({
  format: v.string(),
  fileId: v.string(),
  url: v.string(),
  name: v.string(),
  blur: v.string(),
  userId: v.id("users"),
});

export type CreateBannerSchema = Infer<typeof creatbannerSchema>;
