"use client";
import { useImageUpload } from "@/hooks/use-image-upload";
import { CheckIcon, ImagePlusIcon, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useSession } from "@/provider/session-provider";
import { ImageCropper } from "./image-cropper";
import { stringToFile } from "@/lib/stringToFile";

const Demo = () => {
  const { user } = useSession();
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name ?? "");
  const [banner, setBanner] = useState<File | undefined>(undefined);
  const debounced = useDebounce(username, 1000);
  const { data, isPending, isError } = useQuery(
    api.user.user_service.searchUsername,
    {
      username: debounced.length > 0 ? debounced : "skip",
    },
  );

  const handleBanner = (url: string, name: string) => {
    const file = stringToFile(url, name);
    setBanner(file);
  };

  const maxLength = 180;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue: user?.status,
  });
  return (
    <div className="w-full overflow-y-auto">
      <ProfileBg
        defaultImage="https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E"
        onUpload={handleBanner}
      />
      <Avatar defaultImage="/avatar.png" />
      <div className="px-6 pt-4 pb-6">
        <form className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`first-name`}>Name</Label>
              <Input
                id={`first-name`}
                placeholder="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
                required
              />
            </div>
          </div>
          <div className="*:not-first:mt-2">
            <Label htmlFor={`username`}>Username</Label>
            <div className="relative">
              <Input
                id={`username`}
                className="peer pe-9"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  let newValue = e.target.value;
                  newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "-");
                  newValue = newValue.replace(/\s+/g, "-");
                  newValue = newValue.replace(/-+/g, "-");
                  if (newValue.length <= 32) {
                    setUsername(newValue.toLowerCase());
                  }
                }}
                type="text"
                required
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {!data || isError ? (
                      <XIcon
                        size={16}
                        className="text-rose-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <CheckIcon
                        size={16}
                        className="text-emerald-500"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="*:not-first:mt-2">
            <Label htmlFor={`bio`}>Status</Label>
            <Textarea
              id={`bio`}
              placeholder="Write a few sentences about yourself"
              defaultValue={value}
              maxLength={maxLength}
              onChange={handleChange}
              aria-describedby={`description`}
            />
            <p
              id={`description`}
              className="text-muted-foreground mt-2 text-right text-xs"
              role="status"
              aria-live="polite"
            >
              <span className="tabular-nums">{limit - characterCount}</span>{" "}
              characters left
            </p>
          </div>
        </form>
      </div>
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
      <div className="bg-muted relative flex h-full w-full items-center justify-center overflow-hidden">
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
      <ImageCropper
        dialogOpen={isCropOpen}
        setDialogOpen={setIsCropOpen}
        selectedFile={previewUrl}
        handleCropComplete={handleCropComplete}
        aspect={3 / 1}
      />
    </div>
  );
}

function Avatar({ defaultImage }: { defaultImage?: string }) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();

  const currentImage = previewUrl || defaultImage;

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <Image
            src={currentImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={handleThumbnailClick}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
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

export default Demo;
