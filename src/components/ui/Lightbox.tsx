"use client";

import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import {
  AnimatePresence,
  PanInfo,
  LazyMotion,
  domAnimation,
  m,
  motion,
} from "framer-motion";
import { blurhashToDataUri } from "@unpic/placeholder";
import { useLightboxStore } from "@/hooks/use-lightbox";
import NextImage from "next/image";
import { Image } from "@unpic/react/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "./button";

function LightboxRoot({ children }: { children: React.ReactNode }) {
  const { isOpen } = useLightboxStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <LightboxPortal />
            {children}
          </m.div>
        </LazyMotion>
      )}
    </AnimatePresence>
  );
}

function LightboxPortal() {
  const { close } = useLightboxStore();
  return (
    <div
      className="bg-background/90 fixed inset-0 z-40 backdrop-blur-sm"
      onClick={close}
    />
  );
}

function LightboxContent() {
  const { images, index, next, prev } = useLightboxStore();
  const current = images[index];

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 100;
    if (info.offset.x < -swipeThreshold) {
      next();
    } else if (info.offset.x > swipeThreshold) {
      prev();
    }
  };

  return (
    <div className="fixed z-50 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="flex max-h-[80svh] max-w-6xl flex-col items-center justify-center gap-5 overflow-hidden"
        >
          <div className="pointer-events-none select-none">
            <NextImage
              src={current.url}
              placeholder="blur"
              blurDataURL={blurhashToDataUri(current.blur)}
              alt={current.name}
              width={800}
              height={300}
              className="pointer-events-none size-auto max-h-[80svh] rounded-lg object-cover"
              draggable={false}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LightboxClose() {
  const { close, images, index } = useLightboxStore();
  const current = images[index];

  const handleDownload = async () => {
    try {
      const response = await fetch(current.url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = current.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Gagal mengunduh gambar:", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="icon"
          className="bg-accent/40 hover:bg-accent/50 cursor-pointer rounded-full p-2 text-white backdrop-blur-lg"
          onClick={handleDownload}
        >
          <Download size={30} />
        </Button>
        <Button
          size="icon"
          className="bg-accent/40 hover:bg-accent/50 cursor-pointer rounded-full p-2 text-white backdrop-blur-lg"
          onClick={close}
        >
          <X size={30} />
        </Button>
      </div>
    </div>
  );
}

function LightboxPrev() {
  const { prev } = useLightboxStore();
  return (
    <Button
      size="icon"
      className="bg-accent/40 hover:bg-accent/50 absolute left-4 z-50 cursor-pointer rounded-full p-2 text-white backdrop-blur-lg"
      onClick={prev}
    >
      <ChevronLeft size={30} />
    </Button>
  );
}

function LightboxNext() {
  const { next } = useLightboxStore();
  return (
    <Button
      size="icon"
      className="bg-accent/40 hover:bg-accent/50 absolute right-4 z-50 cursor-pointer rounded-full p-2 text-white backdrop-blur-lg"
      onClick={next}
    >
      <ChevronRight size={30} />
    </Button>
  );
}

function LightboxGalley() {
  const { images, index, jumpTo } = useLightboxStore();
  return (
    <div className="fixed bottom-2 z-50 px-3">
      <div className="flex flex-row items-center gap-1 overflow-hidden rounded-md">
        {images.map((item, i) => (
          <Image
            key={item._id}
            src={item.url}
            background={blurhashToDataUri(item.blur)}
            alt={item.name}
            width={40}
            height={40}
            onClick={() => jumpTo(i)}
            className={cn("cursor-pointer object-cover", {
              "brightness-[0.2]": i !== index,
            })}
          />
        ))}
      </div>
    </div>
  );
}

const Lightbox = () => {
  return (
    <LightboxRoot>
      <LightboxContent />
      <LightboxGalley />
      <LightboxClose />
      <LightboxNext />
      <LightboxPrev />
    </LightboxRoot>
  );
};

export default Lightbox;
