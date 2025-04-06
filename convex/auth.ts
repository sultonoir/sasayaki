import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { internal } from "./_generated/api";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      console.log(args);
      if (args.existingUserId) return;

      await ctx.db.patch(args.userId, {
        username: args.profile.email,
        name: args.profile.email,
      });
      await ctx.scheduler.runAfter(
        0,
        internal.member.member_service.autoAddMember,
        { id: args.userId },
      );
    },
  },
});
