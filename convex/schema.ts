import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { todo } from "./todo/todo_model";
import { presence, presence_heartbeats } from "./presence/presence_model";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  todo,
  presence,
  presence_heartbeats,
});

export default schema;
