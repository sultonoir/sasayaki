"use client";

import { Globe, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import ErrorToast from "../ui/error-toast";

interface Props {
  chatId: Id<"chat">;
  goingTobotom: () => void;
}

export default function ChatInput({ chatId, goingTobotom }: Props) {
  const mutate = useMutation(api.message.message_service.sendMessage);
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });
  const [showSearch, setShowSearch] = useState(true);

  const handleSubmit = async () => {
    try {
      await mutate({ chatId, body: value });
    } catch (error) {
      let message = "";
      if (error instanceof ConvexError) {
        message = error.data;
      }
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = "Error send message";
      }

      return toast.custom((t) => <ErrorToast name={message} t={t} />);
    }
    setValue("");
    goingTobotom();
    adjustHeight(true);
  };

  return (
    <div className="relative mx-auto w-full">
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
            <label className="cursor-pointer rounded-lg bg-black/5 p-2 dark:bg-white/5">
              <input type="file" className="hidden" />
              <Paperclip className="h-4 w-4 text-black/40 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white" />
            </label>
            <button
              type="button"
              onClick={() => {
                setShowSearch(!showSearch);
              }}
              className={cn(
                "flex h-8 cursor-pointer items-center gap-2 rounded-full border px-1.5 py-1 transition-all",
                showSearch
                  ? "border-sky-400 bg-sky-500/15 text-sky-500"
                  : "border-transparent bg-black/5 text-black/40 hover:text-black dark:bg-white/5 dark:text-white/40 dark:hover:text-white",
              )}
            >
              <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                <motion.div
                  animate={{
                    rotate: showSearch ? 180 : 0,
                    scale: showSearch ? 1.1 : 1,
                  }}
                  whileHover={{
                    rotate: showSearch ? 180 : 15,
                    scale: 1.1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                >
                  <Globe
                    className={cn(
                      "h-4 w-4",
                      showSearch ? "text-sky-500" : "text-inherit",
                    )}
                  />
                </motion.div>
              </div>
              <AnimatePresence>
                {showSearch && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: "auto",
                      opacity: 1,
                    }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 overflow-hidden text-sm whitespace-nowrap text-sky-500"
                  >
                    Search
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <div className="absolute right-3 bottom-3">
            <button
              type="button"
              onClick={handleSubmit}
              className={cn(
                "rounded-lg p-2 transition-colors",
                value
                  ? "bg-sky-500/15 text-sky-500"
                  : "cursor-pointer bg-black/5 text-black/40 hover:text-black dark:bg-white/5 dark:text-white/40 dark:hover:text-white",
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
