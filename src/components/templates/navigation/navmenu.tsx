"use client";
import { Button } from "@/components/ui/button";
import { Bookmark, Home, MessageCircleMoreIcon, User2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SignoutButton } from "../button/button-signout";
import { useSession } from "@/provider/session-provider";
// import NotificationButton from "../notification/notification-button";

export type NavMenuProps = React.HTMLAttributes<HTMLDivElement>;

export default function NavMenu({ className }: NavMenuProps) {
  const { user } = useSession();
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Chat"
        asChild
      >
        <Link href="/chats">
          <MessageCircleMoreIcon />
          <span className="hidden lg:inline">Chats</span>
        </Link>
      </Button>
      {/* <NotificationButton /> */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title={`/pofile/${user?.username}`}
        asChild
      >
        <Link href={`/pofile/${user?.username}`}>
          <User2 />
          <span className="hidden lg:inline">Profile</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
      <SignoutButton />
    </div>
  );
}
