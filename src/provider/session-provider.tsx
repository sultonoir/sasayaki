"use client";
import React from "react";
import { useOnline } from "@/hooks/use-online";
import dynamic from "next/dynamic";

const DialogCreateGroup = dynamic(
  () => import("@/components/form/group/form-create-group"),
  {
    ssr: false,
  },
);

const SessionProvider = () => {
  useOnline();
  return (
    <>
      <DialogCreateGroup />
    </>
  );
};

export default SessionProvider;
