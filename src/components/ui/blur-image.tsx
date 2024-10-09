"use client";

import { useEffect, useState } from "react";
import { type ImageProps } from "next/image";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
interface BlurImageProps extends Omit<ImageProps, "blurDataURL"> {
  fallbackBlur?: string;
}

export function BlurImage({
  src,
  className,
  fallbackBlur = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  ...props
}: BlurImageProps) {
  const [blurDataURL, setBlurDataURL] = useState<string>(fallbackBlur);
  useEffect(() => {
    const generateBlurPlaceholder = async () => {
      if (typeof src !== "string") return;

      try {
        const image = new Image();
        image.src = src;
        image.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        canvas.width = 8;
        canvas.height = 8;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(image, 0, 0, 8, 8);
        ctx.filter = "blur(4px)";
        ctx.drawImage(canvas, 0, 0, 8, 8, 0, 0, canvas.width, canvas.height);

        const blurredDataURL = canvas.toDataURL();
        setBlurDataURL(blurredDataURL);
      } catch (error) {
        console.error("Error generating blur placeholder:", error);
      }
    };

    void generateBlurPlaceholder();
  }, [src]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  return (
    <NextImage
      {...props}
      ref={ref}
      src={src}
      className={cn(className, {
        blur: !inView,
      })}
      alt="images"
      loading={inView ? "eager" : "lazy"}
      priority={inView}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
}
