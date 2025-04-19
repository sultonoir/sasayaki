import { Doc, Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // Optional, but helpful for nested state

interface Servers extends Doc<"server"> {
  image: Doc<"serverImage">;
  username?: string;
  memberId: Id<"member">;
}

interface Server {
  serverId: Id<"server">;
  username?: string;
  memberId: Id<"member">;
}

interface UseServerProfileStore {
  status: "initial" | "loading" | "success" | undefined;
  servers: Servers[];
  setServers: (value: Servers[]) => void;
  selectedServer: Server | undefined;
  setStatus: (value: UseServerProfileStore["status"]) => void;
  setSelectedServer: (value: Server | undefined) => void;
  changeUsername: (value: string | undefined) => void;
}

export const useServerProfile = create<UseServerProfileStore>()(
  immer((set) => ({
    status: undefined,
    selectedServer: undefined,
    servers: [],
    setServers: (servers) => set({ servers }),
    setStatus: (status) => set(() => ({ status })),
    setSelectedServer: (selectedServer) => set(() => ({ selectedServer })),
    changeUsername: (username) =>
      set((state) => {
        if (state.selectedServer) {
          state.selectedServer.username = username;
        }
      }),
  })),
);
