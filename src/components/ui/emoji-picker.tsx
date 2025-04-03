/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmileIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import dynamic from "next/dynamic";
import { Skeleton } from "./skeleton";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  {
    ssr: false,
    loading: () => (
      <Skeleton className="flex min-h-[484px] w-full min-w-[384px] items-center justify-center" />
    ),
  },
);

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer rounded-lg bg-black/5 p-2 dark:bg-white/5">
          <SmileIcon className="h-4 w-4 text-black/40 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Picker
          theme={theme === "dark" ? "dark" : ("light" as any)}
          onEmojiClick={(e) => {
            onChange(e.emoji);
            console.log(e.emoji);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
