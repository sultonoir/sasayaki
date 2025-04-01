import { defineTable } from "convex/server";
import { v } from "convex/values";

export const chat = defineTable({
  name: v.string(),
  image: v.string(),
  createdAt: v.number(),
  code: v.string(),
  isGroup: v.boolean(),
})
  .index("by_chat_code", ["code"])
  .index("by_chat_name", ["name"])
  .searchIndex("by_search_name", {
    searchField: "name",
  });
