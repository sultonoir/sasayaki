"use client";

import React, { useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { stringToFile } from "@/lib/stringToFile";
import { ImageCropper } from "@/components/ui/image-cropper";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

interface FieldImageProps extends React.HTMLAttributes<HTMLElement> {
  images: File[];
  setImages: (values: File[]) => void;
  placeholder?: string;
}

export default function FieldImage({
  images,
  setImages,
  className,
  placeholder = "Drag 'n' drop some images here, or click to select images",
}: FieldImageProps) {
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = React.useState<string>();
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleCropComplete = React.useCallback(
    (croppedImageUrl: string) => {
      const file = stringToFile(croppedImageUrl, name);
      setImages([file]);
    },
    [name, setImages],
  );

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles?.[0]) return;

    const file = acceptedFiles[0];

    const fileWithPreview = URL.createObjectURL(file);
    setName(file.name);
    setSelectedFile(fileWithPreview);
    setDialogOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  // Cleanup URL.createObjectURL
  React.useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile);
      }
    };
  }, [selectedFile]);

  return (
    <div className="space-y-4">
      <ImageCropper
        dialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        selectedFile={selectedFile}
        handleCropComplete={handleCropComplete}
      />

      {images.length > 0 ? (
        <div className="flex items-center justify-center">
          <div className="relative size-36 cursor-pointer rounded-full ring-2 ring-slate-200 ring-offset-2">
            <Image
              className="rounded-full"
              width={144}
              height={144}
              src={URL.createObjectURL(images[0])}
              alt="Preview"
            />
            <div className="absolute inset-0" {...getRootProps()}>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                {...getInputProps()}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            {
              "border-primary bg-primary/10": isDragActive,
              "border-border": !isDragActive,
            },
            className,
          )}
        >
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            {...getInputProps()}
          />
          <Upload className="mx-auto h-12 w-12" />
          <p className="mt-2 text-sm">
            {isDragActive ? "Drop the images here ..." : placeholder}
          </p>
        </div>
      )}
    </div>
  );
}
