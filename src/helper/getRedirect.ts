"use server";
import { redirect } from "next/navigation";

export const getRedirect = (path: string) => {
  return redirect(path);
};
