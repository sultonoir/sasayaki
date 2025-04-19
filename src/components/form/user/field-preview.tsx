import { useProfileEdit } from "@/provider/profile-edit-provider";
import React from "react";
import { FieldBannerPreview } from "./field-banner";
import { FieldAvatarPreview } from "./field-avatar";

const FieldPreview = () => {
  const { state } = useProfileEdit();
  return (
    <div className="h-fit w-full flex-none shrink-0 overflow-hidden rounded-lg border md:max-w-[260px]">
      <FieldBannerPreview />
      <FieldAvatarPreview />
      <div className="p-4">
        <p className="pb-1 leading-none font-semibold">{state.name}</p>
        <p className="text-muted-foreground pb-4 text-xs">{state.username}</p>
        <p className="text-muted-foreground max-w-xs truncate pb-4 text-xs">
          {state.bio}
        </p>
        <div className="hover:bg-accent group bg-accent/80 inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-center text-xs">
          Example button
        </div>
      </div>
    </div>
  );
};

export default FieldPreview;
