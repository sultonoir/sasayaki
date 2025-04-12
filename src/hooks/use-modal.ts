import { create } from "zustand";

interface ModalStore {
  open: boolean;
  toggle: () => void;
  close: () => void;
  setOpen: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
  setOpen: () => set({ open: true }),
}));
