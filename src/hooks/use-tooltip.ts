import { create } from "zustand";

interface TooltipStore {
  messageId: string;
  setMessageId: (messageId: string) => void;
}
export const useToolTip = create<TooltipStore>((set) => ({
  messageId: "",
  setMessageId: (messageId) => set({ messageId }),
}));
