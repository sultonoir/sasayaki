import { create } from "zustand";

interface DialogGroupStore {
  open: boolean;
  setOpen: () => void;
}

export const useDialogGroup = create<DialogGroupStore>((set) => ({
  open: false,
  setOpen: () => set((state) => ({ open: !state.open })),
}));
