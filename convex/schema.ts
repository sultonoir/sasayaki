import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { todo } from "./todo/todo_model";
import { presence, presence_heartbeats } from "./presence/presence_model";
import { group } from "./group/group_model";
import { groupMessage, groupAttachment } from "./group/group_messages_model";
import { directMessage, directAttachment } from "./direct/direct_message_model";
import { directChat } from "./direct/direct_chat_model";
import { groupRead } from "./group/group_read_model";
import { member } from "./member/member_model";

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
  group,
  groupMessage,
  groupAttachment,
  directChat,
  directMessage,
  directAttachment,
  member,
  groupRead,
});

export default schema;
