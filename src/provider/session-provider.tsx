"use client";
import React from "react";
import { useOnline } from "@/hooks/use-online";

const SessionProvider = () => {
  useOnline();
  return (
    <div
      className="sr-only"
      tabIndex={0}>
      Sasayaki.
    </div>
  );
};

export default SessionProvider;
