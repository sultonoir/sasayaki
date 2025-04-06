import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "../_generated/api";
import { DataModel } from "../_generated/dataModel";

export const memberAggregate = new TableAggregate<{
  Namespace: string;
  Key: number; // [status, timestamp]
  DataModel: DataModel;
  TableName: "member";
}>(components.memberUserAggregae, {
  namespace: (doc) => doc.serverId,
  sortKey: (doc) => doc._creationTime,
});
