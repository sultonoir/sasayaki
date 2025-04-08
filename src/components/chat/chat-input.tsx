"use client";

import { FileIcon, Loader2, Paperclip, Send, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import ErrorToast from "../ui/error-toast";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "../ui/button";
import { UploadedFile } from "@/types";
import { useChat } from "@/hooks/use-chat";
import Emoji from "../ui/emoji";
import { useParams, usePathname } from "next/navigation";

interface Props {
  goingTobotom: () => void;
}

export default function ChatInput({ goingTobotom }: Props) {
  const { setReply, reply } = useChat();

  //pending state
  const [isPending, setisPending] = useState(false);

  //image state
  const [images, setImages] = useState<File[]>([]);

  // body state
  const [value, setValue] = useState("");

  //caling mutation
  const mutate = useMutation(api.message.message_service.sendMessage);

  //text area ref
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });

  //validation group chat or dm
  const pathname = usePathname();
  const { channel, dm } = useParams<{ channel: string; dm: string }>();

  const channelId = pathname.startsWith("/server") ? channel : dm;

  const handleSubmit = async () => {
    setisPending(true);

    try {
      const uploadImage: UploadedFile[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("folder", channelId);

        const result = await fetch("/api/image", {
          method: "POST",
          body: formData,
        });

        if (!result.ok) {
          toast.error("Failed to upload files");
          return;
        }

        const data = await result.json<{
          success: boolean;
          results: UploadedFile[];
        }>();

        uploadImage.push(...data.results);
        if (!data.success || !data.results) {
          toast.error("Failed to upload files");
          return;
        }
      }
      // Submit the message with attachments (uploaded images)
      await mutate({
        channelId,
        body: value,
        attachments: uploadImage,
        parentId: reply?._id,
      });
    } catch (error) {
      let message = "Error sending message";
      if (error instanceof ConvexError) {
        message = error.data || message;
      }
      if (error instanceof Error) {
        message = error.message || message;
      }
      setisPending(false);
      return toast.custom((t) => <ErrorToast name={message} t={t} />);
    }
    setReply(undefined);
    setisPending(false);
    setImages([]); // Clear images after submission
    setValue(""); // Clear text input
    goingTobotom();
    adjustHeight(true);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Filter file yang belum ada di daftar images
      const newImages = acceptedFiles.filter(
        (item) => !images.some((a) => a.name === item.name),
      );

      // Hitung total setelah ditambahkan
      const totalImages = images.length + newImages.length;

      // Jika jumlah total lebih dari 10, batasi dan beri peringatan
      if (totalImages > 10) {
        toast.error("Too many uploads! You can only upload up to 10 files.");
        return;
      }

      // Update state dengan gambar baru yang lolos filter
      setImages([...images, ...newImages]);
    },
    [images],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  const removeImage = useCallback((name: string) => {
    setImages((prev) => prev.filter((i) => i.name !== name));
  }, []);

  return (
    <>
      {isPending && images.length > 0 && (
        <div className="flex items-center gap-4 p-3">
          <FileIcon size={30} className="fill-primary/30 stroke-primary" />
          <div className="flex flex-col gap-1">
            <p>Progress...</p>
            <div className="bg-muted after:bg-primary relative h-2 w-[200px] overflow-hidden rounded-lg after:absolute after:h-full after:w-1/2" />
          </div>
        </div>
      )}
      {!isPending && images.length > 0 && (
        <ImageGallery images={images} removeImage={removeImage} />
      )}
      <div className="relative flex flex-col">
        <div className="max-h-[200px] overflow-y-auto">
          <Textarea
            id="ai-input-04"
            onFocus={() => {
              console.log("text focus");
            }}
            onBlur={() => {
              console.log("text blur");
            }}
            value={value}
            placeholder="Type a message"
            className="w-full resize-none rounded-none border-none bg-black/5 px-4 py-3 leading-[1.2] placeholder:text-black/70 focus-visible:ring-0 dark:bg-white/5 dark:text-white dark:placeholder:text-white/70"
            ref={textareaRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
          />
        </div>
        <div className="h-12 bg-black/5 dark:bg-white/5">
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div
              {...getRootProps()}
              className="cursor-pointer rounded-lg bg-black/5 p-2 dark:bg-white/5"
            >
              <input
                type="file"
                multiple
                className="hidden"
                {...getInputProps()}
              />
              <Paperclip className="h-4 w-4 text-black/40 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white" />
            </div>
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <Emoji onEmojiSelect={(e) => setValue((prev) => prev + e)} />
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className={cn(
                "rounded-lg p-2 transition-colors",
                value
                  ? "bg-sky-500/15 text-sky-500"
                  : "cursor-pointer bg-black/5 text-black/40 hover:text-black dark:bg-white/5 dark:text-white/40 dark:hover:text-white",
              )}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const ImageGallery = ({
  images,
  removeImage,
}: {
  images: File[];
  removeImage: (name: string) => void;
}) => {
  const [imageURLs, setImageURLs] = useState<{ name: string; url: string }[]>(
    [],
  );

  useEffect(() => {
    const newImageURLs = images.map((image) => {
      return new Promise<{ name: string; url: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ name: image.name, url: reader.result as string });
        reader.readAsDataURL(image);
      });
    });

    Promise.all(newImageURLs).then(setImageURLs);
  }, [images]);

  return (
    <div className="relative flex max-w-[calc(100svw-360px)] items-center gap-4 overflow-x-auto p-3">
      {imageURLs.map(({ name, url }) => (
        <div className="relative min-w-[200px]" key={name}>
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-1 right-1 size-7"
            onClick={() => removeImage(name)}
          >
            <Trash2 />
          </Button>
          <Image width={200} height={230} alt={name} src={url} />
        </div>
      ))}
    </div>
  );
};
