/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as chatlist from "../chatlist.js";
import type * as direct_direct_chat_model from "../direct/direct_chat_model.js";
import type * as direct_direct_message_model from "../direct/direct_message_model.js";
import type * as group_group_messages_model from "../group/group_messages_model.js";
import type * as group_group_model from "../group/group_model.js";
import type * as group_group_read_model from "../group/group_read_model.js";
import type * as group_group_service from "../group/group_service.js";
import type * as http from "../http.js";
import type * as member_member_model from "../member/member_model.js";
import type * as member_member_service from "../member/member_service.js";
import type * as presence_presence_model from "../presence/presence_model.js";
import type * as presence_presence_service from "../presence/presence_service.js";
import type * as todo_todo_model from "../todo/todo_model.js";
import type * as todo_todo_service from "../todo/todo_service.js";
import type * as typing_typing_model from "../typing/typing_model.js";
import type * as user_user_service from "../user/user_service.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chatlist: typeof chatlist;
  "direct/direct_chat_model": typeof direct_direct_chat_model;
  "direct/direct_message_model": typeof direct_direct_message_model;
  "group/group_messages_model": typeof group_group_messages_model;
  "group/group_model": typeof group_group_model;
  "group/group_read_model": typeof group_group_read_model;
  "group/group_service": typeof group_group_service;
  http: typeof http;
  "member/member_model": typeof member_member_model;
  "member/member_service": typeof member_member_service;
  "presence/presence_model": typeof presence_presence_model;
  "presence/presence_service": typeof presence_presence_service;
  "todo/todo_model": typeof todo_todo_model;
  "todo/todo_service": typeof todo_todo_service;
  "typing/typing_model": typeof typing_typing_model;
  "user/user_service": typeof user_user_service;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
