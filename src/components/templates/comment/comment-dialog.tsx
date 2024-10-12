"use client";
import React from "react";
import useCommentDialog from "@/hooks/useCommentDialog";
import UserAvatar from "../user/user-avatar";
import { formatRelativeDate } from "@/lib/format-relative-date";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { FormComment } from "../form/comment/form-comment";
import { Button } from "@/components/ui/button";

export const CommentDialog = () => {
  const { setIsOpen, isOpen, thread } = useCommentDialog();

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent>
        <CredenzaHeader className="flex w-full flex-row gap-4 space-y-0">
          <div className="flex flex-col items-center">
            <UserAvatar
              avatarUrl={thread?.user?.image ?? "/avatar-placeholder.png"}
              className="flex-shrink-0"
              size={40}
            />
            <div className="relative mt-2 w-0.5 grow rounded-full bg-neutral-800"></div>
          </div>
          <div className="flex flex-col gap-1">
            <CredenzaTitle className="font-nor inline-flex gap-2 text-[14px] leading-5">
              <span className="block font-bold capitalize text-foreground hover:underline">
                {thread?.user.name}
              </span>
              <span className="text-muted-foreground">
                @{thread?.user?.username}
              </span>
              <p
                className="block text-sm text-muted-foreground hover:underline"
                suppressHydrationWarning
              >
                {formatRelativeDate(new Date(thread?.createdAt ?? new Date()))}
              </p>
            </CredenzaTitle>
            <CredenzaDescription>{thread?.content}</CredenzaDescription>
            <div className="py-5 text-[14px] leading-5">
              <span className="text-muted-foreground">Reply</span>
              <span className="ml-2 text-primary">
                @{thread?.user.username}
              </span>
            </div>
          </div>
        </CredenzaHeader>
        <CredenzaBody>
          <FormComment threadId={thread?.id ?? ""} type="dialog" />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline" className="w-full lg:hidden">
              Close
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
