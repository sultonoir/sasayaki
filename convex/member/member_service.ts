import { v } from "convex/values";
import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getMemberByServer = query({
  args: { id: v.id("server"), pctx: paginationOptsValidator },
  async handler(ctx, { id, pctx }) {
    const member = await ctx.db
      .query("member")
      .withIndex("by_member_server", (q) => q.eq("serverId", id))
      .paginate(pctx);
  },
});
