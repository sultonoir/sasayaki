import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type Session = Doc<"users"> 


interface SessionStore {
  user: Session | null;
  setSession: (session: Session | null | undefined) => void;
}

export const useSession = create<SessionStore>((set) => ({
  user: null,
  setSession: (user) => set({ user }),
}));
