import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config";

const app = defineApp();

app.use(aggregate, { name: "messageIdAggregate" });
app.use(aggregate, { name: "memberUserAggregae" });
app.use(aggregate, { name: "messageUserAggregate" });

export default app;
