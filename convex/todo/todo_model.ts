import { defineTable } from "convex/server";
import { v } from "convex/values";

export const todo = defineTable({
  value: v.string(),
});
