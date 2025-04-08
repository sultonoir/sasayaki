import { v } from "convex/values";
import { mutation, query, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { asyncMap } from "convex-helpers";
import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";

export const createServer = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    image: v.object({
      format: v.string(),
      fileId: v.string(),
      url: v.string(),
      name: v.string(),
      blur: v.string(),
    }),
  },
  handler: async (ctx, { name, image, code }) => {
    const user = await mustGetCurrentUser(ctx);

    const server = await ctx.db.insert("server", {
      name,
      ownerId: user._id,
      code,
    });

    const channel = ctx.db.insert("channel", {
      name: "general",
      serverId: server,
      private: false,
    });

    const member = ctx.db.insert("member", {
      userId: user._id,
      serverId: server,
      joinedAt: Date.now(),
    });

    const imageServer = ctx.db.insert("serverImage", {
      ...image,
      serverId: server,
    });

    await Promise.all([channel, member, imageServer]);
  },
});

/**
 * helper get server from member
 */

async function getServerByMember({ ctx }: { ctx: QueryCtx }) {
  const user = await mustGetCurrentUser(ctx);
  const members = await ctx.db
    .query("member")
    .withIndex("by_member_userid", (q) => q.eq("userId", user._id))
    .collect();

  const servers = await asyncMap(members, async (member) => {
    const server = await ctx.db.get(member.serverId);
    const image = await ctx.db
      .query("serverImage")
      .withIndex("by_server_image_Id", (q) => q.eq("serverId", member.serverId))
      .unique();

    const channel = await ctx.db
      .query("channel")
      .withIndex("by_server_channel", (q) => q.eq("serverId", member.serverId))
      .first();

    if (!server || !image || !channel) {
      return null;
    }

    return {
      ...server,
      image,
      channel,
    };
  });

  return servers.filter((item) => item !== null);
}

/**
 * get server list
 */

export const getServers = query({
  handler: async (ctx) => {
    return await getServerByMember({ ctx });
  },
});

export const getServerByChannelId = query({
  args: { id: v.id("channel") },
  async handler(ctx, { id }) {
    const channel = await ctx.db.get(id);

    if (!channel) return null;

    const server = await ctx.db.get(channel.serverId);
    const serverimage = await getOneFrom(
      ctx.db,
      "serverImage",
      "by_server_image_Id",
      channel.serverId,
      "serverId",
    );

    if (!server || !serverimage) return null;

    return {
      ...server,
      channel: channel.name,
      image: serverimage,
    };
  },
});

export const getServerByid = query({
  args: { id: v.id("server") },
  async handler(ctx, { id }) {
    const user = await mustGetCurrentUser(ctx);
    const server = await ctx.db.get(id);

    const serverimage = await getOneFrom(
      ctx.db,
      "serverImage",
      "by_server_image_Id",
      id,
      "serverId",
    );

    const channel = await getManyFrom(
      ctx.db,
      "channel",
      "by_server_channel",
      id,
      "serverId",
    );

    const access = await ctx.db
      .query("access")
      .withIndex("by_all_access", (q) =>
        q.eq("userId", user._id).eq("serverId", id),
      )
      .first();

    if (!server || !serverimage || !access) return null;

    const owner = server.ownerId === user._id;

    return {
      ...server,
      image: serverimage,
      channel,
      access,
      owner,
    };
  },
});
