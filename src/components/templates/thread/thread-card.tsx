"use client";

import { useSession } from "@/provider/session-provider";
import { type Thread } from "@/types";
import UserAvatar from "../user/user-avatar";
import Linkify from "@/components/ui/linkify";
import { formatRelativeDate } from "@/lib/format-relative-date";
import ThreadImageGallery from "./thread-image-gallery";
import Link from "next/link";
import ThreadMenuButton from "./thread-menu-button";

interface PostProps {
  post: Thread;
  type: "page" | "card";
}

export function ThreadCard({ post, type }: PostProps) {
  const { user } = useSession();

  const username = `@${post.user.username}`;

  return (
    <article className="group/post relative space-y-3 p-5 shadow-sm">
      <div className="relative flex gap-3">
        <Link
          href={`/thread/${post.id}`}
          aria-label={`View post ${post.id}`}
          tabIndex={-1}
          className="absolute inset-0 z-0"
        >
          <span className="sr-only">View post {post.id}</span>
        </Link>
        <div className="relative z-10 h-fit flex-shrink-0">
          <UserAvatar avatarUrl={post.user.image} size={40} />
        </div>
        <div className="relative z-10 flex flex-grow flex-col space-y-3">
          <div className="flex gap-2 text-[15px] leading-5">
            <Linkify>{post.user.name}</Linkify>
            <Linkify>{username}</Linkify>

            <p className="text-muted-foreground">•</p>
            <p
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(new Date(post.createdAt))}
            </p>
          </div>
          <Linkify>
            <div className="whitespace-pre-line break-words">
              {post.content}
            </div>
          </Linkify>
          {!!post.media.length && <ThreadImageGallery images={post.media} />}
          {/* {type === "card" && (
            <div className="flex justify-between gap-5">
              <ThreadComment initialData={post} />
              <ThreadLikeButton initialdata={post.like} threadId={post.id} />
              <ThreadRepostButton
                initialdata={post.repost}
                threadId={post.id}
              />
              <ThreadBookmarButton
                initialData={post.isBookmarked}
                threadId={post.id}
              />
            </div>
          )} */}
        </div>
        {post.user.username === user?.username ? (
          <ThreadMenuButton
            post={post}
            className="relative z-10 flex-shrink-0 opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        ) : (
          <div className="w-9" />
        )}
      </div>
      {/* {type === "page" && (
        <div className="flex justify-between gap-5 border-y py-1">
          <ThreadComment initialData={post} />
          <ThreadLikeButton initialdata={post.like} threadId={post.id} />
          <ThreadRepostButton initialdata={post.repost} threadId={post.id} />
          <ThreadBookmarButton
            initialData={post.isBookmarked}
            threadId={post.id}
          />
        </div>
      )} */}
    </article>
  );
}
