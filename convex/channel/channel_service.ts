import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAccess } from "../access/access_service";

export const createChannel = mutation({
  args: { serverId: v.id("server"), name: v.string(), private: v.boolean() },
  async handler(ctx, args) {
    const access = await getAccess(ctx, args.serverId);

    if (!access?.create) {
      throw new ConvexError("u dont have access to create channel");
    }

    await ctx.db.insert("channel", args);
  },
});

export const editChannel = mutation({
  args: {
    serverId: v.id("server"),
    name: v.string(),
    private: v.boolean(),
    channelId: v.id("channel"),
  },
  async handler(ctx, args) {
    const access = await getAccess(ctx, args.serverId);

    if (!access?.create) {
      throw new ConvexError("u dont have access to create channel");
    }

    await ctx.db.patch(args.channelId, {
      name: args.name,
      private: args.private,
    });
  },
});
