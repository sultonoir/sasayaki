// app/api/user-offline/route.ts
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json<{ userId: string; timestamp: string }>();
    const { userId, timestamp } = body;

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Simulasi update status user di database
    console.log(
      `User ${userId} is now offline at ${new Date(timestamp).toISOString()}`,
    );

    await fetchMutation(api.user.user_service.updateOnlineUser, {
      userId: userId as unknown as Id<"users">,
      online: false,
      lastSeen: Date.now(),
    });

    return NextResponse.json({ message: "User marked as offline" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to mark user offline" },
      { status: 500 },
    );
  }
}
