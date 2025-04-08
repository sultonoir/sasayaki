import { Triggers } from "convex-helpers/server/triggers";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import {
  internalMutation as internalMutationRaw,
  mutation as mutationRaw,
} from "../_generated/server";
import { DataModel } from "../_generated/dataModel";
import { messageAggregate, messageUserAggregate } from "./message_aggregate";

const triggers = new Triggers<DataModel>();

triggers.register("message", messageAggregate.trigger());
triggers.register("message", messageUserAggregate.trigger());

export const mutation = customMutation(mutationRaw, customCtx(triggers.wrapDB));

export const internalMutation = customMutation(
  internalMutationRaw,
  customCtx(triggers.wrapDB),
);
