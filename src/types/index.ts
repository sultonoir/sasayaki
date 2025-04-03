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
