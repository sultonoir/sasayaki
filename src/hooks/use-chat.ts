import { Id } from "@/convex/_generated/dataModel";
import { Messages } from "@/types";
import { create } from "zustand";

interface Props {
  reply: Messages | undefined;
  setReply: (reply: Messages | undefined) => void;
  findMessage: Id<"message"> | undefined;
  setFindMessage: (findMessage: Id<"message"> | undefined) => void;
  shift: boolean;
  setShift: (shift: boolean) => void;
}

export const useChat = create<Props>((set) => ({
  reply: undefined,
  setReply: (reply) => set({ reply }),
  findMessage: undefined,
  setFindMessage: (findMessage) => set({ findMessage }),
  shift: false,
  setShift: (shift) => set({ shift }),
}));
