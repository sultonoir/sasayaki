import { v } from "convex/values";
import { mutation, query, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { asyncMap } from "convex-helpers";
import { getManyFrom } from "convex-helpers/server/relationships";

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
 * helper get server hirarki list
 */

async function getServerHirarki({ ctx }: { ctx: QueryCtx }) {
  const user = await mustGetCurrentUser(ctx);
  const serverlists = await ctx.db
    .query("serverList")
    .withIndex("by_server_list_userId", (q) => q.eq("userId", user._id))
    .order("desc")
    .collect();

  const servers = await asyncMap(serverlists, async (list) => {
    const server = await ctx.db
      .query("server")
      .withIndex("by_id", (q) => q.eq("_id", list.serverId))
      .unique();
    const image = await ctx.db
      .query("serverImage")
      .withIndex("by_server_image_Id", (q) => q.eq("serverId", list.serverId))
      .unique();

    if (!server || !image) {
      return null;
    }

    return {
      ...server,
      image,
    };
  });

  return servers.filter((item) => item !== null);
}

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
    if (!server || !image) {
      return null;
    }

    return {
      ...server,
      image,
    };
  });

  return servers.filter((item) => item !== null);
}

/**
 * get server list
 */

export const getServers = query({
  handler: async (ctx) => {
    const serverhirarki = await getServerHirarki({ ctx });

    if (serverhirarki.length === 0) {
      return await getServerByMember({ ctx });
    }

    return serverhirarki;
  },
});

export const editServerHirarki = mutation({
  args: {
    servers: v.array(v.id("server")),
  },
  handler: async (ctx, { servers }) => {
    const user = await mustGetCurrentUser(ctx);
    const serverhirarki = await getManyFrom(
      ctx.db,
      "serverList",
      "by_server_list_userId",
      user._id,
      "userId",
    );
    
    if (serverhirarki.length === 0) {
      await Promise.all(
        servers.map(async (server, index) => {
          await ctx.db.insert("serverList", {
            serverId: server,
            userId: user._id,
            hirarki: index,
          });
        }),
      );

      return;
    }

    await Promise.all(
      serverhirarki.map(async (server, index) => {
        await ctx.db.patch(server._id, {
          hirarki: index,
        });
      }),
    );
  },
});
