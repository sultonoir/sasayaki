import { create } from "zustand";

interface ImageUploadState {
  previewUrl?: string;
  fileName: string | null;
  rawFile?: File;
  isCropOpen: boolean;
  setPreviewUrl: (url?: string) => void;
  setFileName: (name: string | null) => void;
  setRawFile: (file?: File) => void;
  setIsCropOpen: (val: boolean) => void;
  reset: () => void;
}

export const useImageUploadStore = create<ImageUploadState>((set) => ({
  previewUrl: undefined,
  fileName: null,
  rawFile: undefined,
  isCropOpen: false,

  setPreviewUrl: (url) => set({ previewUrl: url }),
  setFileName: (name) => set({ fileName: name }),
  setRawFile: (file) => set({ rawFile: file }),
  setIsCropOpen: (val) => set({ isCropOpen: val }),

  reset: () =>
    set({
      previewUrl: undefined,
      fileName: null,
      rawFile: undefined,
      isCropOpen: false,
    }),
}));
