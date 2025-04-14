"use client";

import DmHeader from "@/components/dm/dm-header";
import { PageHeader } from "@/components/ui/page-layouting";
import { useDialogGroup } from "@/hooks/use-dialog-group";
import { DmPage } from "@/types";
import { Separator } from "../ui/separator";
import DmUserProfile from "./dm-user-profile";
import ChatBody from "../chat/chat-body";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

interface DmLayoutProps {
  user: DmPage;
  channelId: string;
}

const DmLayout = ({ user, channelId }: DmLayoutProps) => {
  const { open } = useDialogGroup();

  const mutate = useMutation(api.read.read_service.createRead);

  useEffect(() => {
    void mutate({ channelId });
  }, [channelId, mutate]);

  return (
    <>
      <PageHeader
        title="Direct messages"
        url="/logo.png"
        blur={user.blur}
        type={"image"}
      />
      <Separator className="mx-0" />
      <DmHeader
        name={user.name || "unknown user"}
        image={user.image}
        blur={user.blur}
        online={!!user.online}
      />
      <Separator className="mx-0" />
      <div className="relative isolate flex size-full overflow-x-hidden">
        <div
          data-state={open ? "open" : "close"}
          className="bg-card flex size-full flex-col transition-all duration-300 ease-in-out will-change-transform data-[state=open]:lg:mr-[300px]"
        >
          <ChatBody channelId={channelId} />
        </div>
        <DmUserProfile user={user} />
      </div>
    </>
  );
};

export default DmLayout;
