import { Doc } from "@/convex/_generated/dataModel";

export interface UploadedFile {
  url: string;
  fileId: string;
  name: string;
  blur: string;
  format: string;
}

export type Member = Doc<"member"> & {
  user: Doc<"users">;
  profile: Doc<"userImage"> | null;
};

export type Reply = Doc<"message"> & {
  user: Doc<"users">;
  attachment: Doc<"attachment">[];
  profile: Doc<"userImage"> | null;
};

export type Messages = Doc<"message"> & {
  user: Doc<"users">;
  attachment: Doc<"attachment">[];
  parent: Reply | null;
  profile: Doc<"userImage"> | null;
  access: boolean;
};

export type ServerChat = Doc<"server"> & {
  channel: string;
  image: Doc<"serverImage">;
};

export type Session = Doc<"users"> & {
  profile: Doc<"userImage"> | null;
  banner: Doc<"banner"> | null;
};

export type Group = Doc<"server"> & {
  image: Doc<"serverImage">;
  channel: Doc<"channel">;
};

interface Friend extends Doc<"users"> {
  profile: Doc<"userImage"> | null;
}

export type DmPage = Doc<"users"> & {
  image: string;
  blur: string;
  banner: Doc<"banner"> | null;
  groups: Group[];
  friends: Friend[];
};
