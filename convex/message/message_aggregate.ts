import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "../_generated/api";
import { DataModel } from "../_generated/dataModel";

export const messageAggregate = new TableAggregate<{
  Namespace: string;
  Key: number; // [status, timestamp]
  DataModel: DataModel;
  TableName: "message";
}>(components.messageIdAggregate, {
  namespace: (doc) => doc.chatId,
  sortKey: (doc) => doc._creationTime,
});
