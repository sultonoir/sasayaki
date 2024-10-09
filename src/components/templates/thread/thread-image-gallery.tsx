import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Media } from "@/types";
import { cn } from "@/lib/utils";
import { BlurImage } from "@/components/ui/blur-image";

interface GalleryProps {
  images: Media[];
}

export default function ThreadImageGallery({ images = [] }: GalleryProps) {
  const totalImages = images.length;

  if (totalImages === 1) {
    return <SingleMediaImage src={images[0]} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[10rem]">
      <div
        className={cn("flex mx-auto flex-col", {
          "grid gap-1 grid-cols-2 rounded-2xl overflow-hidden": totalImages > 1,
        })}>
        {images.slice(0, 4).map((image, index) => (
          <ImageDialog
            key={index}
            image={image}
            index={index}
            totalImages={totalImages}
          />
        ))}
      </div>
    </div>
  );
}

function SingleMediaImage({ src }: { src: Media }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col mr-auto cursor-pointer relative rounded-2xl overflow-hidden">
          <BlurImage
            src={src.imageUrl}
            alt="Gallery image"
            width={500}
            height={500}
            className="hover:opacity-90 transition-opacity object-contain size-fit max-h-[30rem] w-auto"
            loading="lazy"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[calc(100vh-64px)] overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col mx-auto cursor-pointer relative">
          <BlurImage
            src={src.imageUrl}
            alt="Gallery image"
            width={800}
            height={500}
            className="size-full object-contain max-h-[calc(100dvh-140px)]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImageDialog({
  image,
  index,
  totalImages,
}: {
  image: Media;
  index: number;
  totalImages: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`relative ${getImageClass(index, totalImages)}`}>
          <BlurImage
            src={image.imageUrl}
            alt={`Gallery image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "cursor-pointer hover:opacity-90 transition-opacity object-contain",
              { "object-cover": totalImages > 1 }
            )}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[calc(100vh-64px)] overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col mx-auto cursor-pointer relative">
          <BlurImage
            src={image.imageUrl}
            alt="Gallery image"
            width={800}
            height={500}
            className="size-full object-contain max-h-[calc(100dvh-140px)]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getImageClass(index: number, total: number) {
  if (total === 1) return "h-[30rem]";
  if (total === 2) return "aspect-square";
  if (total === 3 && index === 0) return "row-span-2";
  return "aspect-square"; // Default case for 3 or more images
}
