import { Doc } from "@/convex/_generated/dataModel";

export interface UploadedFile {
  url: string;
  fileId: string;
  name: string;
  blur: string;
  format: string;
}

export type Member = Doc<"member"> & {
  username: string;
  online: boolean;
  image: string;
};

export type Reply = Doc<"message"> & {
  user: Doc<"users">;
  attachment: Doc<"attachment">[];
};

export type Messages = Doc<"message"> & {
  user: Doc<"users">;
  attachment: Doc<"attachment">[];
  child: Reply | null;
};
