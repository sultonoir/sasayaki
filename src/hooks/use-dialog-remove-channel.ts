import { create } from "zustand";

interface DialogRmChannelGroupStore {
  isOpen: boolean;
  channelId: string;
  setChannelId: (channelId: string) => void;
  setIsOpen: () => void;
  closeDialogRm: () => void;
}

export const useDialogRmChannel = create<DialogRmChannelGroupStore>((set) => ({
  isOpen: false,
  channelId: "",
  setChannelId: (channelId) => set({ channelId }),
  setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  closeDialogRm: () => set({ isOpen: false }),
}));
