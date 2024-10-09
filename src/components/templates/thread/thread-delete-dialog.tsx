import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePostMutation } from "@/server/thread/thread.mutation";
import { Thread } from "@/types";
import { ButtonLoading } from "../button/button-loading";

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
  const mutation = useDeletePostMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ButtonLoading
            variant="destructive"
            onClick={async () => mutation.mutate({ id: post.id })}
            loading={mutation.isPending}>
            Delete
          </ButtonLoading>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
