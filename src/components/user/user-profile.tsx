"use client";

import React, { useState } from "react";
import { XIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";

import { useSaveToast } from "@/hooks/use-save-toast";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useSession } from "@/provider/session-provider";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ToastSave } from "../ui/toast-save";
import { UploadedFile } from "@/types";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { handleError } from "@/lib/handle-eror";
import { useRouter } from "next/navigation";
import FieldPreview from "../form/user/field-preview";
import FieldName from "../form/user/field-name";
import FieldUsername from "../form/user/field-username";
import FieldBio from "../form/user/Field-bio";
import { FieldAvatarButton } from "../form/user/field-avatar";

const MAX_BIO_LENGTH = 180;

const UserProfile = () => {
  const router = useRouter();
  const { user } = useSession();
  const { setOpen, open } = useSaveToast();
  const [banner, setBanner] = useState<File | undefined>();
  const [avatar, setAvatar] = useState<File | undefined>();
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");

  const { value: bio } = useCharacterLimit({
    maxLength: MAX_BIO_LENGTH,
    initialValue: user?.status,
  });

  const mutate = useMutation(api.user.user_service.updateUser);

  async function onUpload(newFiles: File[]) {
    const images: UploadedFile[] = [];
    setOpen("loading");
    try {
      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", "group");

      const result = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        toast.error("Failed to upload files");
        setOpen("initial");
        return;
      }

      const data = await result.json<{
        success: boolean;
        results: UploadedFile[];
      }>();

      if (!data.success || !data.results) {
        toast.error("Failed to upload files");
        setOpen("initial");
        return;
      }

      images.push(...data.results);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      setOpen("initial");
      toast.error("Failed to upload files");
      return;
    }

    await mutate({
      name,
      image:
        images.find((item) => item.name === avatar?.name)?.url || user?.image,
      username,
      status: bio,
      banner: images.find((item) => item.name === banner?.name),
    });

    setOpen("success");
    setTimeout(() => setOpen(undefined), 2000);
  }

  const handleSave = async () => {
    setOpen("loading");
    const files: File[] = [];
    if (avatar) files.push(avatar);
    if (banner) files.push(banner);

    try {
      if (files.length > 0) {
        return await onUpload(files);
      } else {
        await mutate({
          name,
          username,
          status: bio,
        });
      }
    } catch (error) {
      return handleError({ error, message: "Error edit profile" });
    }
    setOpen("success");
    setTimeout(() => setOpen(undefined), 2000);
  };

  const handleReset = () => {
    setName(user?.name || "");
    setUsername(user?.username || "");
    setAvatar(undefined);
    setBanner(undefined);
    setOpen(undefined);
  };

  return (
    <div className="flex flex-1 flex-col space-y-5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg">Profiles</p>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          disabled={open !== undefined}
          onClick={() => router.back()}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* container */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {/* form */}
        <div className="space-y-7">
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
        <FieldPreview />
      </div>

      {/* Save Toast */}
      {open !== undefined && (
        <div className="fixed bottom-2 left-1/2 flex w-full max-w-xl -translate-x-1/3 items-center justify-center">
          <ToastSave
            state={open}
            onSave={handleSave}
            onReset={handleReset}
            className="w-full max-w-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
