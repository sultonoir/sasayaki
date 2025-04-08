import { create } from "zustand";

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  type: "crete" | "upadate";
}

interface DialogCreateChannelStore {
  open: boolean;
  channel: Channel;

  // Method to handle opening and closing
  setOpen: (open: boolean) => void;

  // Method to set ID
  setId: (channel: Channel) => void;
}

export const useDialogCreateChannel = create<DialogCreateChannelStore>(
  (set) => ({
    open: false,
    channel: {
      id: "",
      name: "",
      isPrivate: false,
      type: "crete",
    },

    // This aligns with RadixUI's onOpenChange pattern
    setOpen: (open: boolean) => set({ open }),

    // Method to set ID when needed
    setId: (channel) => set({ channel }),
  }),
);
