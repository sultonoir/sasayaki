import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { internal } from "./_generated/api";
import { faker } from "@faker-js/faker";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (args.existingUserId || args.provider.id === "google") return;

      await ctx.db.patch(args.userId, {
        username: faker.internet.username({
          firstName: emailToName(args.profile.email ?? ""),
        }),
        name: emailToName(args.profile.email ?? ""),
      });

      // await ctx.scheduler.runAfter(
      //   0,
      //   internal.member.member_service.autoAddMember,
      //   {
      //     userId: args.userId,
      //     username: faker.internet.username({ firstName: "sasayaki" }),
      //   },
      // );
    },
  },
});

function emailToName(email: string): string {
  // Ambil bagian sebelum "@" sebagai nama dasar
  const [rawName] = email.split("@");

  // Ganti karakter non-huruf/angka jadi spasi
  const cleaned = rawName.replace(/[^a-zA-Z0-9]/g, " ");

  // Capitalize setiap kata
  return cleaned
    .split(" ")
    .filter(Boolean) // Hapus spasi kosong
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
