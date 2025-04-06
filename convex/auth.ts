import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (args.existingUserId) return;

      await ctx.scheduler.runAfter(
        0,
        internal.member.member_service.autoAddMember,
        { id: args.userId },
      );
    },
  },
});
