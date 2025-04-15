// app/api/user-online/route.ts
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { userId: string; timestamp: string };
    const { userId, timestamp } = body;

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    console.log(
      `User ${userId} is now ONLINE at ${new Date(timestamp).toISOString()}`
    );

    // TODO: Update database status user jadi online
    await fetchMutation(api.user.user_service.updateOnlineUser, {
      userId: userId as unknown as Id<"users">,
      online: true,
      lastSeen: Date.now(),
    });
    // await db.user.update({ where: { id: userId }, data: { isOnline: true } });

    return NextResponse.json({ message: "User marked as online" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to mark user online" },
      { status: 500 }
    );
  }
}
