import { customAlphabet } from "nanoid";

export const generateId = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  10,
);
