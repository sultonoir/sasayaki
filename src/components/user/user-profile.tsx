"use client";

import React from "react";

import { useSession } from "@/provider/session-provider";

import { Separator } from "../ui/separator";
import FieldPreview from "../form/user/field-preview";
import FieldName from "../form/user/field-name";
import FieldUsername from "../form/user/field-username";
import FieldBio from "../form/user/Field-bio";
import { FieldAvatarButton } from "../form/user/field-avatar";

const UserProfile = () => {
  useSession();

  return (
    <div className="flex h-[570px] flex-1 flex-col space-y-5 overflow-x-hidden overflow-y-auto p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg">Profiles</p>
      </div>

      {/* container */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {/* form */}
        <div className="order-2 space-y-7 lg:order-1">
          {/* Name */}
          <FieldName />
          <Separator />

          {/* Username */}
          <FieldUsername />
          <Separator />

          {/* avatar button */}
          <FieldAvatarButton />
          <Separator />

          {/* Bio */}
          <FieldBio />
        </div>
        {/* preview */}
        <div className="order-1 lg:order-2">
          <FieldPreview />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
