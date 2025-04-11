"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (url: string, name: string) => void;
  useCropper?: boolean;
}

export function useImageUpload({
  onUpload,
  useCropper = false,
}: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | undefined>(undefined);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setRawFile(file);

      if (useCropper) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsCropOpen(true); // Buka cropper jika opsi diaktifkan
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      previewRef.current = url;
      onUpload?.(url, file.name);
    },
    [onUpload, useCropper],
  );

  const handleCropComplete = useCallback(
    (url: string) => {
      setIsCropOpen(false);
      setPreviewUrl(url);
      previewRef.current = url;
      onUpload?.(url, fileName ?? "");
    },
    [fileName, onUpload],
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(undefined);
    setFileName(null);
    previewRef.current = null;
    setRawFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    rawFile,
    fileInputRef,
    isCropOpen,
    setIsCropOpen,
    handleThumbnailClick,
    handleFileChange,
    handleCropComplete,
    handleRemove,
  };
}
