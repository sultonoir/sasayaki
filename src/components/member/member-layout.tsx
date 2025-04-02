import { useDialogGroup } from "@/hooks/use-dialog-group";
import { Member } from "@/types";
import React from "react";
import { UserAvatar } from "../user/user-avatar";

interface Props {
  members: Member[];
}

const MemberLayout = ({ members }: Props) => {
  const { open } = useDialogGroup();
  return (
    <div
      data-state={open ? "open" : "close"}
      className="bg-card absolute inset-y-0 right-0 w-full transform border-l transition-all duration-300 ease-in-out will-change-transform data-[state=close]:translate-x-full data-[state=open]:translate-x-0 lg:w-[300px]"
    >
      <div className="absolute inset-0 transition-transform duration-300 ease-in-out">
        <div className="flex h-full grow flex-col gap-1 overflow-y-auto p-3">
          {members.map((member) => (
            <div
              className="hover:bg-accent flex gap-2 rounded-lg p-2"
              key={member._id}
            >
              <UserAvatar
                src={member.image}
                name={member.username}
                online={member.online}
                className="size-fit"
              />
              <div className="flex size-full flex-col">
                <p className="font-semibold">{member.username}</p>
                <p className="self-end text-xs capitalize">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberLayout;
