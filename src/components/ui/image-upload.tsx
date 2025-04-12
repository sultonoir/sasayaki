"use client";

import { AnimatePresence, Reorder } from "framer-motion";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2 } from "lucide-react";
import { UploadedFile } from "@/types";
import { toast } from "sonner";
import { Image } from "@unpic/react/nextjs";
import { blurhashToDataUri } from "@unpic/placeholder";
import { Badge } from "./badge";

interface FieldImageProps {
  images: UploadedFile[];
  setImages: (values: UploadedFile[]) => void;
  folder?: string;
}

export function ImageUpload({
  images,
  setImages,
  folder = "/promo",
}: FieldImageProps) {
  const [isPending, setisPending] = useState(false);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setisPending(true);
      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("folder", folder);

        const result = await fetch("/api/image", {
          method: "POST",
          body: formData,
        });

        if (!result.ok) {
          toast.error("Failed to upload files");
        }

        const data = await result.json<{
          success: boolean;
          results: UploadedFile[];
        }>();

        if (!data.success || !data.results) {
          toast.error("Failed to upload files");
        }

        setImages([...images, ...data.results]);
      } catch (err) {
        setisPending(false);
        if (err instanceof Error) {
          toast.error(err.message);
        }
        toast.error("Failed to upload files");
      }
      setisPending(false);
    },
    [folder, images, setImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-border"
        }`}
      >
        <Input type="file" className="hidden" {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12" />
        <p className="mt-2 text-sm">
          {isDragActive
            ? "Drop the images here ..."
            : "Drag 'n' drop some images here, or click to select images"}
        </p>
      </div>
      {isPending && <Loader2 className="animate-spin" />}
      {!isPending && images.length > 0 && (
        <Gallery images={images} setImages={setImages} />
      )}
    </div>
  );
}

function Gallery({ images, setImages }: FieldImageProps) {
  const removeFile = async (fileId: string) => {
    setImages(images.filter((file) => file.fileId !== fileId));
    try {
      await fetch("/api/image", {
        method: "DELETE",
        body: JSON.stringify({ fileId }),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete file");
      }
    } finally {
      setImages(images.filter((file) => file.fileId !== fileId));
    }
  };

  return (
    <Reorder.Group
      axis="y"
      values={images}
      onReorder={setImages}
      className="flex flex-col flex-wrap gap-3"
    >
      <AnimatePresence>
        {images.map((file, index) => (
          <Reorder.Item
            key={file.fileId}
            value={file}
            initial={{ opacity: 0, x: 30 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.15, delay: index * 0.1 },
            }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
            className="bg-accent flex flex-wrap gap-4 rounded-lg p-2 sm:flex-nowrap"
          >
            <Image
              alt={file.name}
              src={file.url}
              width={100}
              height={100}
              layout="constrained"
              background={blurhashToDataUri(file.blur)}
              className="flex-none rounded-md object-cover"
            />
            <div className="min-w-0 grow space-y-2">
              {index === 0 && <Badge variant="default">Thumbnail</Badge>}
              <div className="max-w-[150px] truncate text-sm font-medium whitespace-pre-line sm:max-w-xs">
                {file.name}
              </div>
            </div>
            <Button
              type="button"
              size="icon"
              className="sm:hover:bg-accent sm:hover:text-accent-foreground w-full flex-none sm:size-9 sm:bg-transparent"
              onClick={() => removeFile(file.fileId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}

export function DemoImage() {
  const [images, setImages] = useState<UploadedFile[]>([]);
  return <ImageUpload images={images} setImages={setImages} />;
}
