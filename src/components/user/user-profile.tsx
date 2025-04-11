"use client";

import React, { ChangeEvent, useState } from "react";
import { CheckIcon, ImagePlusIcon, Loader2, XIcon } from "lucide-react";

import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";

import { useSaveToast } from "@/hooks/use-save-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useSession } from "@/provider/session-provider";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { ToastSave } from "../ui/toast-save";
import { useImageUpload } from "@/hooks/use-image-upload";
import Image from "next/image";
import { stringToFile } from "@/lib/stringToFile";
import { ImageCropper } from "../ui/image-cropper";
import { UploadedFile } from "@/types";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { handleError } from "@/lib/handle-eror";
import { useRouter } from "next/navigation";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

const MAX_BIO_LENGTH = 180;

const UserProfile = () => {
  const router = useRouter();
  const { user } = useSession();
  const { setOpen, open } = useSaveToast();
  const [banner, setBanner] = useState<File | undefined>();
  const [avatar, setAvatar] = useState<File | undefined>();
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");

  const debouncedUsername = useDebounce(username, 500);

  const { data, isPending, isError } = useQuery(
    api.user.user_service.searchUsername,
    {
      username:
        debouncedUsername.length > 0 && debouncedUsername !== user?.username
          ? debouncedUsername
          : "skip",
    },
  );

  const {
    value: bio,
    characterCount,
    handleChange: handleBioChange,
    maxLength: bioMaxLength,
  } = useCharacterLimit({
    maxLength: MAX_BIO_LENGTH,
    initialValue: user?.status,
  });

  const handleAvatar = (url: string, name: string) => {
    URL.revokeObjectURL(url);
    const file = stringToFile(url, name);
    setAvatar(file);
    setOpen("initial");
  };

  const handleBanner = (url: string, name: string) => {
    URL.revokeObjectURL(url);
    const file = stringToFile(url, name);
    setBanner(file);
    setOpen("initial");
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setOpen("initial");
    };

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

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });

  const handleReset = () => {
    setName(user?.name || "");
    setUsername(user?.username || "");
    setAvatar(undefined);
    setBanner(undefined);
    setOpen(undefined);
  };

  const renderUsernameStatus = () => {
    if (isPending) return <Loader2 className="animate-spin" />;
    if (!data || isError)
      return <XIcon size={16} className="text-rose-500" aria-hidden="true" />;
    if (debouncedUsername.length === 0) {
      return null;
    }
    return (
      <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
    );
  };

  return (
    <div className="relative w-full space-y-5">
      <div className="sticky top-10 z-10 flex items-center justify-between">
        <p className="text-lg">Profiles</p>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          disabled={open !== undefined}
          onClick={() => router.push("/")}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* container */}
      <div className="flex w-full flex-col-reverse justify-between gap-10 sm:flex-row">
        {/* form */}
        <div className="w-full max-w-xs space-y-7">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="first-name">Name</Label>
            <Input
              id="first-name"
              placeholder="Matt"
              value={name}
              onChange={handleInputChange(setName)}
              type="text"
              required
            />
          </div>

          <Separator />

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                className="peer pe-9"
                placeholder="Username"
                value={username}
                onChange={handleInputChange(setUsername)}
                type="text"
                required
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                {renderUsernameStatus()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About me</Label>
            <Textarea
              id="bio"
              placeholder="Write a few sentences about yourself"
              className="w-full max-w-xs resize-none bg-black/5 px-4 py-3 leading-[1.2] placeholder:text-black/70 focus-visible:ring-0 dark:placeholder:text-white/70"
              defaultValue={bio}
              maxLength={bioMaxLength}
              ref={textareaRef}
              onChange={(e) => {
                handleBioChange(e);
                adjustHeight();
                setOpen("initial");
              }}
              aria-describedby="description"
            />
            <p
              id="description"
              className="text-muted-foreground mt-2 text-right text-xs"
              role="status"
              aria-live="polite"
            >
              <span className="tabular-nums">
                {bioMaxLength - characterCount}
              </span>{" "}
              characters left
            </p>
          </div>
        </div>
        {/* preview */}
        <div className="h-fit w-full max-w-xs flex-none shrink-0 overflow-hidden rounded-lg border sm:max-w-[260px]">
          <ProfileBg
            onUpload={handleBanner}
            defaultImage={user?.banner?.url ?? ""}
          />
          <Avatar
            defaultImage={user?.image ?? "/avatar.png"}
            onUpload={handleAvatar}
          />
          <div className="p-4">
            <p className="pb-1 leading-none font-semibold">{name}</p>
            <p className="text-muted-foreground pb-4 text-xs">{username}</p>
            <p className="text-muted-foreground max-w-xs truncate pb-4 text-xs">
              {bio}
            </p>
            <div className="hover:bg-accent group bg-accent/80 inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-center text-xs">
              Example button
            </div>
          </div>
        </div>
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

function ProfileBg({
  defaultImage,
  onUpload,
}: {
  defaultImage?: string;
  onUpload: (value: string, name: string) => void;
}) {
  const [hideDefault, setHideDefault] = useState(false);
  const {
    previewUrl,
    fileInputRef,
    isCropOpen,
    setIsCropOpen,
    handleThumbnailClick,
    handleFileChange,
    handleCropComplete,
    handleRemove,
  } = useImageUpload({ onUpload, useCropper: true });

  const currentImage = previewUrl || (!hideDefault ? defaultImage : null);

  const handleImageRemove = () => {
    handleRemove();
    setHideDefault(true);
  };

  return (
    <div className="h-32">
      <ImageCropper
        dialogOpen={isCropOpen}
        setDialogOpen={setIsCropOpen}
        selectedFile={previewUrl}
        handleCropComplete={handleCropComplete}
        aspect={3 / 1}
      />
      <div className="bg-muted/80 relative flex h-full w-full items-center justify-center overflow-hidden">
        {currentImage && (
          <Image
            className="h-full w-full object-cover"
            src={currentImage}
            alt={
              previewUrl
                ? "Preview of uploaded image"
                : "Default profile background"
            }
            width={512}
            height={96}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={handleThumbnailClick}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={handleImageRemove}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload image file"
      />
    </div>
  );
}

function Avatar({
  defaultImage,
  onUpload,
}: {
  defaultImage?: string;
  onUpload: (value: string, name: string) => void;
}) {
  const {
    previewUrl,
    fileInputRef,
    isCropOpen,
    setIsCropOpen,
    handleThumbnailClick,
    handleRemove,
    handleFileChange,
    handleCropComplete,
  } = useImageUpload({ onUpload, useCropper: true });

  const currentImage = previewUrl || defaultImage;

  return (
    <div className="-mt-10 px-3">
      <ImageCropper
        dialogOpen={isCropOpen}
        setDialogOpen={setIsCropOpen}
        selectedFile={previewUrl}
        handleCropComplete={handleCropComplete}
      />
      <div className="border-background bg-muted group relative flex size-20 items-center justify-center rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <Image
            src={currentImage}
            className="h-full w-full rounded-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <div className="bg-card absolute -right-[10px] bottom-[2px] size-7 rounded-full p-1">
          <div className="size-full rounded-full bg-emerald-500"></div>
        </div>
        <div className="group absolute -right-50 w-fit items-center justify-between gap-1 opacity-0 transition-all duration-300 group-hover:-right-33 group-hover:opacity-100">
          <div className="flex cursor-pointer flex-col gap-1 rounded-lg border bg-zinc-700 px-2 py-2 text-xs">
            <span
              className="hover:bg-accent w-full rounded-md px-3 py-1.5 text-center"
              onClick={handleThumbnailClick}
            >
              Change image
            </span>
            <span
              className="hover:bg-accent w-full rounded-md px-3 py-1.5 text-center"
              onClick={handleRemove}
            >
              Remove image
            </span>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}

export default UserProfile;
