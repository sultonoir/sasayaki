import { Button } from "@/components/ui/button";
import { ImageCropper } from "@/components/ui/image-cropper";
import { useImageUpload } from "@/hooks/use-image-upload";
import { stringToFile } from "@/lib/stringToFile";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import { ImagePlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const FieldBannerPreview = () => {
  const { state, dispatch } = useProfileEdit();

  const onUpload = (url: string, name: string) => {
    URL.revokeObjectURL(url);
    const file = stringToFile(url, name);
    dispatch({ type: "SET_BANNER", payload: file });
    dispatch({ type: "SET_REMOVE_BANNER", payload: true });
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

  const currentImage = previewUrl || state.initialBanner?.url;

  const handleRemoveImage = () => {
    if (state.avatar) {
      // Jika user sudah upload gambar baru, hapus dari state dan local preview
      dispatch({ type: "SET_BANNER", payload: undefined });
      handleRemove(); // hapus preview & file input
    }

    // Tetap set ini agar backend tahu bahwa avatar lama harus dihapus
    dispatch({ type: "SET_REMOVE_BANNER", payload: true });
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
              onClick={handleRemoveImage}
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
};

const FieldBannerButton = () => {
  const { state, dispatch } = useProfileEdit();

  const onUpload = (url: string, name: string) => {
    URL.revokeObjectURL(url);
    const file = stringToFile(url, name);
    dispatch({ type: "SET_BANNER", payload: file });
    dispatch({ type: "SET_REMOVE_BANNER", payload: true });
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

  const currentImage = previewUrl || state.initialAvatar;

  const handleRemoveImage = () => {
    if (state.avatar) {
      // Jika user sudah upload gambar baru, hapus dari state dan local preview
      dispatch({ type: "SET_BANNER", payload: undefined });
      handleRemove(); // hapus preview & file input
    }

    // Tetap set ini agar backend tahu bahwa avatar lama harus dihapus
    dispatch({ type: "SET_REMOVE_BANNER", payload: true });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">Change avatar</p>
      <div className="flex gap-2">
        <Button
          onClick={handleThumbnailClick}
          size="sm"
          className="flex h-fit items-center justify-center rounded-lg border py-1.5 text-xs"
        >
          Change Avatar
        </Button>
        {currentImage && (
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

export { FieldBannerPreview, FieldBannerButton };
