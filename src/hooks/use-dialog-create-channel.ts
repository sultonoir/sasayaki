import { create } from "zustand";

interface DialogCreateChannelStore {
  open: boolean;
  id: string;

  // Method to handle opening and closing
  setOpen: (open: boolean) => void;

  // Method to set ID
  setId: (id: string) => void;
}

export const useDialogCreateChannel = create<DialogCreateChannelStore>(
  (set) => ({
    open: false,
    id: "",

    // This aligns with RadixUI's onOpenChange pattern
    setOpen: (open: boolean) => set({ open }),

    // Method to set ID when needed
    setId: (id: string) => set({ id }),
  }),
);
