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
  presence: Doc<"presence">;
};

export type Reply = Doc<"message"> & {
  user: Doc<"users">;
  attachment: Doc<"attachment">[];
};

export type Messages = Doc<"message"> & {
  user: Doc<"users">;
  attachment: Doc<"attachment">[];
  parent: Reply | null;
  access: boolean;
};

export type ServerChat = Doc<"server"> & {
  channel: string;
  image: Doc<"serverImage">;
};
