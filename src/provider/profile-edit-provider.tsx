"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Session } from "@/types";
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useMemo,
} from "react";
import { useSession } from "./session-provider";

export type ToastStatus = "initial" | "loading" | "success" | undefined;

interface ProfileEditState {
  banner: File | undefined;
  avatar: File | undefined;
  username: string;
  name: string;
  bio: string;
  isRmAvatar: boolean;
  isRmBanner: boolean;
  toast: ToastStatus;
  initialAvatar?: string;
  initialBanner?: Doc<"banner"> | null;
}

type ProfileEditAction =
  | { type: "SET_BANNER"; payload: File | undefined }
  | { type: "SET_AVATAR"; payload: File | undefined }
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_REMOVE_AVATAR"; payload: boolean }
  | { type: "SET_REMOVE_BANNER"; payload: boolean }
  | { type: "SET_TOAST"; payload: ToastStatus }
  | { type: "SET_BIO"; payload: string }
  | { type: "RESET"; payload: ProfileEditState };

const createInitialState = (user: Session | null): ProfileEditState => ({
  banner: undefined,
  avatar: undefined,
  username: user?.username || "",
  name: user?.name || "",
  isRmAvatar: false,
  isRmBanner: false,
  toast: undefined,
  initialAvatar: user?.image || user?.profile?.url,
  initialBanner: user?.banner ?? null,
  bio: user?.status || "",
});

function profileEditReducer(
  state: ProfileEditState,
  action: ProfileEditAction,
): ProfileEditState {
  switch (action.type) {
    case "SET_BANNER":
      return { ...state, banner: action.payload };
    case "SET_AVATAR":
      return { ...state, avatar: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_BIO":
      return { ...state, bio: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_REMOVE_AVATAR":
      return { ...state, isRmAvatar: action.payload };
    case "SET_REMOVE_BANNER":
      return { ...state, isRmBanner: action.payload };
    case "SET_TOAST":
      return { ...state, toast: action.payload };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

const ProfileEditContext = createContext<
  | {
      state: ProfileEditState;
      dispatch: Dispatch<ProfileEditAction>;
    }
  | undefined
>(undefined);

export const ProfileEditProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSession();
  const initialState = useMemo(() => createInitialState(user), [user]);
  const [state, dispatch] = useReducer(profileEditReducer, initialState);

  return (
    <ProfileEditContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileEditContext.Provider>
  );
};

export const useProfileEdit = () => {
  const context = useContext(ProfileEditContext);
  if (!context) {
    throw new Error("useProfileEdit must be used within ProfileEditProvider");
  }
  return context;
};
