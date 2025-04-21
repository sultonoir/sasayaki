import { create } from "zustand";
import type { Doc } from "@/convex/_generated/dataModel";

type LightboxStore = {
  images: Doc<"attachment">[];
  index: number;
  isOpen: boolean;
  open: (images: Doc<"attachment">[], index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  jumpTo: (index: number) => void;
};

export const useLightboxStore = create<LightboxStore>((set, get) => ({
  images: [],
  index: 0,
  isOpen: false,
  open: (images, index) => set({ images, index, isOpen: true }),
  close: () => set({ isOpen: false }),
  next: () => {
    const { images, index } = get();
    set({ index: (index + 1) % images.length });
  },
  prev: () => {
    const { images, index } = get();
    set({ index: (index - 1 + images.length) % images.length });
  },
  jumpTo: (index) => {
    const { images } = get();
    set({ index: index % images.length });
  },
}));
