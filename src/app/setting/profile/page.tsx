import UserPage from "@/components/user/user-page";
import { api } from "@/convex/_generated/api";
import { capitalizeWords } from "@/lib/capitalize";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const user = await fetchQuery(
    api.user.user_service.getSession,
    {},
    {
      token: await convexAuthNextjsToken(),
    },
  );

  if (!user) return notFound();

  return {
    title: capitalizeWords(user?.name ?? ""),
  };
}

const ProfilePage = async () => {
  return <UserPage />;
};

export default ProfilePage;
