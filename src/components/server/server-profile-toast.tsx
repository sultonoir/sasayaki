"use client";
import { api } from "@/convex/_generated/api";
import { useServerProfile } from "@/hooks/use-server-profile";
import { handleError } from "@/lib/handle-eror";
import { useMutation } from "convex/react";
import dynamic from "next/dynamic";
import React from "react";

const SaveToast = dynamic(() => import("@/components/ui/toast-save"), {
  ssr: false,
});

const ServerProfileToast = () => {
  const { status, servers, setSelectedServer, selectedServer, setStatus } =
    useServerProfile();
  const mutate = useMutation(api.member.member_service.updateMember);

  const reset = () => {
    const newValue = servers.find(
      (item) => item._id === selectedServer?.serverId,
    );
    if (newValue) {
      setSelectedServer({
        serverId: newValue._id,
        memberId: newValue.memberId,
        username: newValue.username,
      });
    }
    setStatus(undefined);
  };

  const handleSubmit = async () => {
    if (!selectedServer?.username) return;
    setStatus("loading");
    try {
      await mutate({
        memberId: selectedServer.memberId,
        username: selectedServer.username,
      });
    } catch (error) {
      setStatus("initial");
      return handleError({ error, message: "Error change nickname" });
    }
    setStatus("success");
    setTimeout(() => setStatus(undefined), 2000);
  };
  return (
    <>
      {status !== undefined && (
        <div className="w-fullitems-center fixed inset-x-0 bottom-2 z-[100] flex justify-center">
          <SaveToast state={status} onReset={reset} onSave={handleSubmit} />
        </div>
      )}
    </>
  );
};

export default ServerProfileToast;
