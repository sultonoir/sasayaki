import { Doc } from "@/convex/_generated/dataModel";

export interface UploadedFile {
  url: string;
  fileId: string;
  name: string;
  blur: string;
}

export type Member = Doc<"member"> & {
  username: string;
  online: boolean;
  image: string;
};
