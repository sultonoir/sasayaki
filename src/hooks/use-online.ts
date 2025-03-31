"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

const HEARTBEAT_PERIOD = 5000;

export const useOnline = () => {
  const heartbeat = useMutation(api.presence.presence_service.heartbeat);
  const update = useMutation(api.presence.presence_service.update);

  useEffect(() => {
    void update({ isOnline: true });
  }, [update]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void heartbeat();
    }, HEARTBEAT_PERIOD);
    // Whenever we have any data change, it will get cleared.
    return () => clearInterval(intervalId);
  }, [heartbeat]);
};
