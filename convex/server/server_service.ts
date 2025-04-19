import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { asyncMap } from "convex-helpers";
import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { getReadChannel, getReadServer } from "../read/read_service";
import { Id } from "../_generated/dataModel";
import { stream } from "convex-helpers/server/stream";
import schema from "../schema";

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
      username: user.name,
      joinedAt: Date.now(),
    });

    const access = ctx.db.insert("access", {
      userId: user._id,
      serverId: server,
      read: true,
      update: true,
      remove: true,
      create: true,
    });

    const imageServer = ctx.db.insert("serverImage", {
      ...image,
      serverId: server,
    });

    await Promise.all([channel, member, imageServer, access]);
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
      .filter((q) => q.eq(q.field("private"), false))
      .first();

    const count = await getReadServer(ctx, member.serverId);

    if (!server || !image || !channel) {
      return null;
    }

    return {
      ...server,
      image,
      channel,
      count,
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

    const newChannels = await asyncMap(channel, async (ch) => {
      const count = await getReadChannel(ctx, ch._id);

      return {
        ...ch,
        count,
      };
    });

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
      channel: newChannels,
      access,
      owner,
    };
  },
});

export const removeServer = mutation({
  args: { serverId: v.id("server") },
  async handler(ctx, { serverId }) {
    const user = await mustGetCurrentUser(ctx);

    const server = await ctx.db.get(serverId);

    if (!server) {
      throw new ConvexError("server not found");
    }

    if (server.ownerId !== user._id) {
      throw new ConvexError("you dont have access to remove server");
    }

    await ctx.db.delete(server._id);
  },
});

export const getServerMutual = async (
  ctx: QueryCtx,
  currentId: Id<"users">,
  otherId: Id<"users">,
) => {
  // Ambil semua member untuk kedua user
  const currentMembers = await ctx.db
    .query("member")
    .withIndex("by_member_userid", (q) => q.eq("userId", currentId))
    .collect();

  const otherMembers = await ctx.db
    .query("member")
    .withIndex("by_member_userid", (q) => q.eq("userId", otherId))
    .collect();

  // Temukan server yang sama
  const currentServerIds = new Set(
    currentMembers.map((m) => m.serverId.toString()),
  );
  const mutualServerIds = otherMembers
    .filter((m) => currentServerIds.has(m.serverId.toString()))
    .map((m) => m.serverId);

  if (mutualServerIds.length === 0) {
    return [];
  }

  // Ambil server dan gambar server dalam satu loop asyncMap
  const results = await asyncMap(mutualServerIds, async (serverId) => {
    const server = await ctx.db.get(serverId);

    if (!server) return null;

    const image = await ctx.db
      .query("serverImage")
      .withIndex("by_server_image_Id", (q) => q.eq("serverId", serverId))
      .first();

    const channel = await ctx.db
      .query("channel")
      .withIndex("by_server_channel", (q) => q.eq("serverId", serverId))
      .first();

    if (!channel) return null;

    if (!image) return null;

    return {
      ...server,
      image,
      channel,
    };
  });

  return results.filter((item) => item !== null);
};

export const getServerByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const server = await getOneFrom(
      ctx.db,
      "server",
      "by_server_code",
      code,
      "code",
    );

    if (!server) return null;

    const image = await ctx.db
      .query("serverImage")
      .withIndex("by_server_image_Id", (q) => q.eq("serverId", server._id))
      .unique();

    if (!image) return null;

    const findMembers = getManyFrom(
      ctx.db,
      "member",
      "by_member_server",
      server._id,
      "serverId",
    );

    const memberOnline = await asyncMap(findMembers, async (member) => {
      const user = await ctx.db.get(member.userId);

      return {
        ...member,
        user,
      };
    });

    return {
      ...server,
      image,
      allMember: memberOnline.length,
      memebrOnline: memberOnline.filter(
        (item) => item.user !== null && item.user.online === true,
      ).length,
    };
  },
});

export const getMyServer = query({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);
    if (!user) return [];

    const members = stream(ctx.db, schema)
      .query("member")
      .withIndex("by_member_userid", (q) => q.eq("userId", user._id))
      .map(async (member) => {
        const server = await ctx.db.get(member.serverId);
        if (!server) return null;
        const image = await getOneFrom(
          ctx.db,
          "serverImage",
          "by_server_image_Id",
          server._id,
          "serverId",
        );

        if (!image) return null;
        return {
          ...server,
          image,
          username: member.username,
          memberId: member._id,
        };
      });

    return members.collect();
  },
});

export const editServer = mutation({
  args: {
    serverId: v.id("server"),
    name: v.string(),
    imageId: v.id("serverImage"),
    image: v.optional(
      v.object({
        format: v.string(),
        fileId: v.string(),
        url: v.string(),
        name: v.string(),
        blur: v.string(),
      }),
    ),
  },
  handler: async (ctx, { serverId, name, image, imageId }) => {
    const user = await mustGetCurrentUser(ctx);
    const access = await ctx.db
      .query("access")
      .withIndex("by_all_access", (q) =>
        q.eq("userId", user._id).eq("serverId", serverId),
      )
      .first();

    if (!access?.update) {
      throw new ConvexError("Error edit data");
    }

    if (image) {
      await ctx.db.patch(imageId, { ...image });
    }

    await ctx.db.patch(serverId, { name });
  },
});
