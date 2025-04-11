import { useMemo } from "react";

interface UseShowMediaProps {
  avatar?: File;
  initialAvatar?: string;
  isRmAvatar: boolean;
}

export function useShowMedia({
  avatar,
  initialAvatar,
  isRmAvatar,
}: UseShowMediaProps) {
  const previewUrl = useMemo(() => {
    if (!avatar) return undefined;
    return URL.createObjectURL(avatar);
  }, [avatar]);

  const currentImage = useMemo(() => {
    if (isRmAvatar && !avatar) return undefined;
    return previewUrl || initialAvatar;
  }, [isRmAvatar, avatar, previewUrl, initialAvatar]);

  const shouldShow = !!currentImage;

  return {
    currentImage,
    shouldShow,
  };
}
