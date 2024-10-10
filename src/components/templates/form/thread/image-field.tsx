import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

type Props = {
  images: File[];
  setImages: (value: File[]) => void;
  submitButton: React.ReactNode;
};

const ImagesField = ({ images, setImages, submitButton }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const newFilesArray = Array.from(files);
    const currentImages = images; // State value for images

    // Limit the number of files to 4
    const limitedNewFiles = newFilesArray.slice(0, 4 - currentImages.length);

    // Filter out files that already exist in the current images
    const uniqueNewFiles = limitedNewFiles.filter(
      (file) =>
        !currentImages.some((existingFile) => existingFile.name === file.name),
    );

    // Update the state only if there are new unique files or URLs
    if (uniqueNewFiles.length > 0) {
      setImages([...currentImages, ...uniqueNewFiles]);
    }
  };

  const handleRemoveImage = (name: string) => {
    const newFile = [...images].filter((item) => item.name !== name);
    setImages(newFile);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset nilai input file
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {!!images.length && (
        <div className="mx-auto min-h-[10rem] w-full max-w-2xl">
          <div className="mx-auto grid grid-cols-2 gap-1 overflow-hidden rounded-2xl">
            {images.map((image) => (
              <div key={image.name} className="relative aspect-square">
                <Button
                  size="icon"
                  className="absolute right-2 top-2 z-20 rounded-full bg-background hover:bg-background/80"
                  onClick={() => handleRemoveImage(image.name)}
                >
                  <XIcon />
                </Button>
                <Image
                  key={image.name}
                  src={URL.createObjectURL(image)}
                  fill
                  alt={image.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-3.5">
          <div className="size-5">
            <input
              id="upload"
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Label
              htmlFor="upload"
              className="cursor-pointer text-muted-foreground"
            >
              <ImagePlus />
            </Label>
          </div>
        </div>
        {submitButton}
      </div>
    </div>
  );
};

export default ImagesField;
