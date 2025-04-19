import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ImageCropper } from "../ui/image-cropper";
import Image from "next/image";
import { useShowMedia } from "@/hooks/use-show-media";
import { stringToFile } from "@/lib/stringToFile";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { UploadedFile } from "@/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { handleError } from "@/lib/handle-eror";
import { blurhashToDataUri } from "@unpic/placeholder";

interface Props {
  image: Doc<"serverImage">;
  name: string;
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function DialogEditServer({
  isOpen,
  onOpenChange,
  name,
  image,
}: Props) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Server</DialogTitle>
            <DialogDescription>
              Make changes to your server here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <ServerForm image={image} name={name} onClose={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit server</DrawerTitle>
          <DrawerDescription>
            Make changes to your server here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ServerForm image={image} name={name} onClose={onOpenChange} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface ServerFormProps extends React.ComponentProps<"form"> {
  image: Doc<"serverImage">;
  name: string;
  onClose: () => void;
}

function ServerForm({ className, image, name, onClose }: ServerFormProps) {
  const { server } = useParams<{ server: Id<"server"> }>();
  const mutate = useMutation(api.server.server_service.editServer);
  const [isPending, setIsPending] = React.useState(false);
  const [newName, setNewName] = React.useState(name);
  const [newImage, setNewImage] = React.useState<File | undefined>();
  const onUpload = (url: string, name: string) => {
    URL.revokeObjectURL(url);
    const file = stringToFile(url, name);
    setNewImage(file);
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
    avatar: newImage,
    initialAvatar: image.url,
    isRmAvatar: false,
  });

  const handleRemoveImage = () => {
    if (newImage) {
      // Jika user sudah upload gambar baru, hapus dari state dan local preview
      setNewImage(undefined);
      handleRemove(); // hapus preview & file input
    }
  };

  const handleupload = async (newFiles: File[]) => {
    const result = await fetch("/api/image", {
      method: "DELETE",
      body: JSON.stringify({ fileId: image.fileId }),
    });

    if (!result.ok) {
      toast.error("Failed to upload files");
      return;
    }

    setIsPending(true);
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
        setIsPending(false);
        return;
      }

      const data = (await result.json()) as {
        success: boolean;
        results: UploadedFile[];
      };

      if (!data.success || !data.results) {
        toast.error("Failed to upload files");
        setIsPending(false);
        return;
      }

      await mutate({
        name: newName,
        serverId: server,
        imageId: image._id,
        image: data.results[0],
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      setIsPending(false);
      toast.error("Failed to upload files");
      return;
    }

    setIsPending(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (newImage) {
        return await handleupload([newImage]);
      }
      await mutate({
        name: newName,
        serverId: server,
        imageId: image._id,
      });
    } catch (error) {
      setIsPending(false);
      handleError({ error, message: "error edit server" });
      return;
    }
    setIsPending(false);
    onClose();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn("grid items-start gap-4 p-4", className)}
      >
        <div className="group/banner relative isolate mx-auto flex size-36 items-center justify-center rounded-full shadow-xs shadow-black/10">
          {shouldShow && (
            <Image
              src={currentImage ?? "/avatar.png"}
              className="rounded-full object-cover"
              width={144}
              height={144}
              placeholder="blur"
              blurDataURL={blurhashToDataUri(image.blur)}
              alt="Profile image"
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
            {shouldShow && (
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            aria-label="Upload profile picture"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <Button type="submit" loading={isPending} disabled={isPending}>
          Save changes
        </Button>
      </form>
      <ImageCropper
        dialogOpen={isCropOpen}
        setDialogOpen={setIsCropOpen}
        selectedFile={previewUrl}
        handleCropComplete={handleCropComplete}
      />
    </>
  );
}
