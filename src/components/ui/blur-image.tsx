"use client";

import { type ImageProps } from "next/image";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
interface BlurImageProps extends Omit<ImageProps, "blurDataURL"> {
  fallbackBlur?: string;
}

export function BlurImage({ src, className, ...props }: BlurImageProps) {
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
    />
  );
}
