import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2Icon } from "lucide-react";
import { useSession } from "@/provider/session-provider";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CommentsPage, CommentWithUser } from "@/types";
import { toast } from "sonner";
import ky from "ky";
import { ButtonLoading } from "../button/button-loading";

interface Props extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  threadId: string;
  commentId: string;
  ownerId: string;
}

export const CommentDeleteDialog = ({
  className,
  threadId,
  commentId,
}: Props) => {
  const { user } = useSession();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      threadId,
      commentId,
    }: {
      threadId: string;
      commentId: string;
    }) =>
      ky
        .patch("/v1/thread/comment/", {
          json: {
            threadId,
            commentId,
          },
        })
        .json<CommentWithUser>(),
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", threadId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) => ({
                nextCursor: page.nextCursor,
                comments: page.comments.filter(
                  (p) => p.id !== deletedComment.id
                ),
              })),
            };
          }
        }
      );

      toast.success("Comment deleted");
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to delete comment");
    },
  });

  const handleDelete = () => {
    if (!user) {
      toast.error("You must be logged in to delete a comment");
    }
    mutation.mutate({ threadId, commentId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ButtonLoading
          size="icon"
          variant="ghost"
          className={className}>
          <Trash2Icon className="size-5 text-red-700" />
        </ButtonLoading>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this post, you won&apos;t be able to restore it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-700 hover:bg-red-700/90"
            onClick={handleDelete}
            disabled={mutation.isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
