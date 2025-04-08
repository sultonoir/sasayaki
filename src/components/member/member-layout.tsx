import { useDialogGroup } from "@/hooks/use-dialog-group";
import React from "react";
import ChatLoader from "../chat/chat-loader";

const MemberLayout = () => {
  const { open } = useDialogGroup();
  return (
    <div
      data-state={open ? "open" : "close"}
      className="bg-card absolute inset-y-0 right-0 w-full transform border-l transition-all duration-300 ease-in-out will-change-transform data-[state=close]:translate-x-full data-[state=open]:translate-x-0 lg:w-[300px]"
    >
      <div className="absolute inset-0 transition-transform duration-300 ease-in-out">
        <div className="flex size-full flex-col overflow-y-auto">
          <ChatLoader length={200} />
        </div>
      </div>
    </div>
  );
};

export default MemberLayout;
