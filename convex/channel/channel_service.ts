import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAccess } from "../access/access_service";
import { getManyFrom } from "convex-helpers/server/relationships";

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

export const removeChannel = mutation({
  args: {
    channelId: v.id("channel"),
    serverId: v.id("server"),
  },
  async handler(ctx, { channelId, serverId }) {
    const access = await getAccess(ctx, serverId);
    if (!access) {
      throw new ConvexError("You cant remove this channel");
    }

    const channel = await getManyFrom(
      ctx.db,
      "channel",
      "by_server_channel",
      serverId,
      "serverId",
    );

    if (channel.length <= 1) {
      throw new ConvexError("Cant remove last channel");
    }

    await ctx.db.delete(channelId);
  },
});
