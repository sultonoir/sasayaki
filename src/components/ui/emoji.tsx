import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmileIcon } from "lucide-react";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "@/components/ui/emoji-picker";

interface EmojiPickerProps {
  onEmojiSelect: (value: string) => void;
}

const Emoji = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer rounded-lg bg-black/5 p-2 dark:bg-white/5">
          <SmileIcon className="h-4 w-4 text-black/40 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-lg p-0">
        <EmojiPicker
          className="h-[326px] shadow-md"
          onEmojiSelect={({ emoji }) => {
            onEmojiSelect(emoji);
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};

export default Emoji;
