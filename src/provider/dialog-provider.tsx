"use client";
import React from "react";
import dynamic from "next/dynamic";

const DialogCreateGroup = dynamic(
  () => import("@/components/form/group/form-create-group"),
  {
    ssr: false,
  },
);

const DialogCreateChannel = dynamic(
  () => import("@/components/form/channel/dialog-create-channel"),
  {
    ssr: false,
  },
);

const DialogRmChannel = dynamic(
  () => import("@/components/form/channel/dialog-remove-channel"),
  {
    ssr: false,
  },
);

const DialogProvider = () => {
  return (
    <>
      <DialogCreateGroup />
      <DialogCreateChannel />
      <DialogRmChannel />
    </>
  );
};

export default DialogProvider;
