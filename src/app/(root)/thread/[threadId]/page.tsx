import ButtonBack from "@/components/templates/button/button-back";
import { CommentLayout } from "@/components/templates/comment/comment-layout";
import { FormComment } from "@/components/templates/form/comment/form-comment";
import { ThreadCard } from "@/components/templates/thread/thread-card";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: {
    threadId: string;
  };
}

const Page = async ({ params }: Props) => {
  const post = await api.thread.getSingleThread({
    id: params.threadId,
  });

  if (!post) {
    return notFound();
  }
  return (
    <div className="flex min-h-screen w-full flex-col space-y-2 border-x-2">
      <ButtonBack/>
      <ThreadCard post={post} type="page" />
      <FormComment
        threadId={post.id}
        type="field"
        className="border-b-2 p-5 pt-0"
      />
      <CommentLayout id={post.id} ownerId={post.userId} />
    </div>
  );
};

export default Page;
