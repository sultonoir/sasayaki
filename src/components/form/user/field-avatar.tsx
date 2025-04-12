import { Button } from "@/components/ui/button";
import { ImageCropper } from "@/components/ui/image-cropper";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useShowMedia } from "@/hooks/use-show-media";
import { stringToFile } from "@/lib/stringToFile";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import Image from "next/image";
import React from "react";

const FieldAvatarPreview = () => {
  const { state, dispatch } = useProfileEdit();

  const onUpload = (url: string, name: string) => {
    URL.revokeObjectURL(url);
    const file = stringToFile(url, name);
    dispatch({ type: "SET_AVATAR", payload: file });
    dispatch({ type: "SET_REMOVE_AVATAR", payload: true });
    dispatch({ type: "SET_TOAST", payload: "initial" });
  };

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

  const { currentImage, shouldShow } = useShowMedia({
    avatar: state.avatar,
    initialAvatar: state.initialAvatar,
    isRmAvatar: state.isRmAvatar,
  });

  const handleRemoveImage = () => {
    if (state.avatar) {
      // Jika user sudah upload gambar baru, hapus dari state dan local preview
      dispatch({ type: "SET_AVATAR", payload: undefined });
      handleRemove(); // hapus preview & file input
    }

    // Tetap set ini agar backend tahu bahwa avatar lama harus dihapus
    dispatch({ type: "SET_REMOVE_AVATAR", payload: true });
    dispatch({ type: "SET_TOAST", payload: "initial" });
  };

  return (
    <div className="-mt-10 px-3">
      <ImageCropper
        dialogOpen={isCropOpen}
        setDialogOpen={setIsCropOpen}
        selectedFile={previewUrl}
        handleCropComplete={handleCropComplete}
      />
      <div className="border-background bg-muted group/banner relative flex size-20 items-center justify-center rounded-full border-4 shadow-xs shadow-black/10">
        {shouldShow && (
          <Image
            src={currentImage ?? "/avatar.png"}
            className="h-full w-full rounded-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <div className="bg-card absolute -right-[10px] bottom-[2px] size-7 rounded-full p-1">
          <div className="size-full rounded-full bg-emerald-500"></div>
        </div>
        <div className="absolute -right-96 w-fit items-center justify-between gap-1 opacity-0 transition-all duration-300 group-hover/banner:-right-33 group-hover/banner:opacity-100">
          <div className="bg-muted flex cursor-pointer flex-col gap-1 rounded-lg border px-2 py-2 text-xs">
            <span
              className="hover:bg-accent hover:text-primary-foreground text-muted-foreground w-full rounded-md px-3 py-1.5 text-center"
              onClick={handleThumbnailClick}
            >
              Change image
            </span>
            <span
              className="hover:bg-accent hover:text-primary-foreground text-muted-foreground w-full rounded-md px-3 py-1.5 text-center"
              onClick={handleRemoveImage}
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
};

const FieldAvatarButton = () => {
  const { state, dispatch } = useProfileEdit();

  const onUpload = (url: string, name: string) => {
    URL.revokeObjectURL(url);
    const file = stringToFile(url, name);
    dispatch({ type: "SET_AVATAR", payload: file });
    dispatch({ type: "SET_REMOVE_AVATAR", payload: true });
  };

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

  const { shouldShow } = useShowMedia({
    avatar: state.avatar,
    initialAvatar: state.initialAvatar,
    isRmAvatar: state.isRmAvatar,
  });

  const handleRemoveImage = () => {
    if (state.avatar) {
      // Jika user sudah upload gambar baru, hapus dari state dan local preview
      dispatch({ type: "SET_AVATAR", payload: undefined });
      handleRemove(); // hapus preview & file input
    }

    // Tetap set ini agar backend tahu bahwa avatar lama harus dihapus
    dispatch({ type: "SET_REMOVE_AVATAR", payload: true });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm">Change avatar</p>
      <div className="flex gap-2">
        <Button
          onClick={handleThumbnailClick}
          size="sm"
          className="flex h-fit items-center justify-center rounded-lg border py-1.5 text-xs"
        >
          Change Avatar
        </Button>
        {shouldShow && (
          <Button
            onClick={handleRemoveImage}
            variant="link"
            className="flex h-fit items-center justify-center rounded-lg py-1.5 text-xs"
          >
            Remove Avatar
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload profile picture"
        />
        <ImageCropper
          dialogOpen={isCropOpen}
          setDialogOpen={setIsCropOpen}
          selectedFile={previewUrl}
          handleCropComplete={handleCropComplete}
        />
      </div>
    </div>
  );
};

export { FieldAvatarButton, FieldAvatarPreview };
