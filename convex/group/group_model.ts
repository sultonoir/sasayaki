import { defineTable } from "convex/server";
import { v } from "convex/values";

export const group = defineTable({
  name: v.string(),
  owner: v.id("users"),
  createdAt: v.number(),
  description: v.optional(v.string()),
  image: v.string(),
}).index("group_owner", ["owner"]);
