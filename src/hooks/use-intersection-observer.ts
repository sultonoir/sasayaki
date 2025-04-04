import { useEffect, useRef } from "react";

export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {},
) {
  const targetRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => callbackRef.current(), 300); // Tingkatkan delay untuk stabilitas
      }
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [options]); // Hapus callback dari dependencies karena sudah menggunakan callbackRef

  return targetRef;
}
