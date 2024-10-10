import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Thread } from "@/types";
import { ButtonLoading } from "../button/button-loading";
import { api } from "@/trpc/react";

interface DeletePostDialogProps {
  post: Thread;
  open: boolean;
  onClose: () => void;
}

export default function DeleteThreadDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const utils = api.useUtils();
  const mutation = api.thread.deleteThread.useMutation({
    onSuccess: async (newThread) => {
      await utils.thread.getAllThreads.cancel();
      utils.thread.getAllThreads.setInfiniteData({ limit: 10 }, (oldData) => {
        const firstPage = oldData?.pages[0];

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: firstPage.posts.filter(
                  (post) => post.id !== newThread.id,
                ),
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }

        return oldData;
      });
      onClose();
    },
  });

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this thread ? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ButtonLoading
            variant="destructive"
            onClick={async () => mutation.mutate({ id: post.id })}
            loading={mutation.isPending}
          >
            Delete
          </ButtonLoading>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
