import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface SessionStore {
  user: Doc<"users"> | null;
  setSession: (session: Doc<"users"> | null | undefined) => void;
}

export const useSession = create<SessionStore>((set) => ({
  user: null,
  setSession: (user) => set({ user }),
}));
