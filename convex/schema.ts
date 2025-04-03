import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { todo } from "./todo/todo_model";
import { presence, presence_heartbeats } from "./presence/presence_model";
import { chat } from "./chat/chat_model";
import { member } from "./member/member_model";
import { message } from "./message/message_model";
import { attachment } from "./attachment/attachment_model";
import { read } from "./read/read_model";
import { junk } from "./junk/junk_model";
import { typing } from "./typing/typing_model";

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
  chat,
  message,
  member,
  attachment,
  read,
  junk,
  typing,
});

export default schema;
