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
import { messageAggregate } from "./message_aggregate";

const triggers = new Triggers<DataModel>();

triggers.register("message", messageAggregate.trigger());

export const mutation = customMutation(mutationRaw, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  internalMutationRaw,
  customCtx(triggers.wrapDB),
);
