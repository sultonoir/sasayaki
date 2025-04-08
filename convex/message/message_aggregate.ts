import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "../_generated/api";
import { DataModel } from "../_generated/dataModel";

export const messageAggregate = new TableAggregate<{
  Namespace: string;
  Key: number; // [status, timestamp]
  DataModel: DataModel;
  TableName: "message";
}>(components.messageIdAggregate, {
  namespace: (doc) => doc.channelId,
  sortKey: (doc) => doc._creationTime,
});

export const messageUserAggregate = new TableAggregate<{
  Namespace: string; // channelId
  Key: [string, number]; // [userId, timestamp]
  DataModel: DataModel;
  TableName: "message";
}>(components.messageUserAggregate, {
  namespace: (doc) => doc.channelId,
  sortKey: (doc) => [doc.userId, doc._creationTime],
});
