import { create } from "zustand";

interface SaveToastStore {
  open: "initial" | "loading" | "success" | undefined;
  setOpen: (value: "initial" | "loading" | "success" | undefined) => void;
}

export const useSaveToast = create<SaveToastStore>((set) => ({
  open: undefined,
  setOpen: (state) => set({ open: state }),
}));
