import { type Thread } from "@/types";
import { create } from "zustand";

interface CommentDialogStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  thread: Thread | undefined;
  setThread: (thread: Thread | undefined) => void;
}

const useCommentDialog = create<CommentDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  thread: undefined,
  setThread: (thread: Thread | undefined) => set({ thread }),
}));

export default useCommentDialog;
