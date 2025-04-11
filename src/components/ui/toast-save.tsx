"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToastSaveProps extends HTMLMotionProps<"div"> {
  state: "initial" | "loading" | "success";
  onReset?: () => void;
  onSave?: () => void;
  loadingText?: string;
  successText?: string;
  initialText?: string;
  resetText?: string;
  saveText?: string;
}

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    className="text-current"
  >
    <g
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <circle cx="9" cy="9" r="7.25"></circle>
      <line x1="9" y1="12.819" x2="9" y2="8.25"></line>
      <path
        d="M9,6.75c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
        fill="currentColor"
        data-stroke="none"
        stroke="none"
      ></path>
    </g>
  </svg>
);

const springConfig = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 1,
};

export function ToastSave({
  state = "initial",
  onReset,
  onSave,
  loadingText = "Saving",
  successText = "Changes Saved",
  initialText = "Unsaved changes",
  resetText = "Reset",
  saveText = "Save",
  className,
  ...props
}: ToastSaveProps) {
  return (
    <motion.div
      className={cn(
        "inline-flex h-10 w-full max-w-2xl items-center justify-center overflow-hidden rounded-full",
        "bg-background/95 backdrop-blur",
        "border border-black/[0.08] dark:border-white/[0.08]",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_16px_-4px_rgba(0,0,0,0.1)]",
        "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_16px_-4px_rgba(0,0,0,0.2)]",
        className,
      )}
      initial={false}
      animate={{ width: "auto" }}
      transition={springConfig}
      {...props}
    >
      <div className="flex h-full items-center justify-between px-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            className="text-foreground flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            {state === "loading" && (
              <>
                <Spinner size="sm" />
                <div className="text-[13px] leading-tight font-normal whitespace-nowrap">
                  {loadingText}
                </div>
              </>
            )}
            {state === "success" && (
              <>
                <div className="flex items-center justify-center gap-1.5 overflow-hidden rounded-[99px] border border-emerald-500/20 bg-emerald-500/10 p-0.5 shadow-sm dark:border-emerald-500/25 dark:bg-emerald-500/25">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div className="text-[13px] leading-tight font-normal whitespace-nowrap">
                  {successText}
                </div>
              </>
            )}
            {state === "initial" && (
              <>
                <div className="text-foreground/80">
                  <InfoIcon />
                </div>
                <div className="text-[13px] leading-tight font-normal whitespace-nowrap">
                  {initialText}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {state === "initial" && (
            <motion.div
              className="ml-2 flex items-center gap-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ ...springConfig, opacity: { duration: 0 } }}
            >
              <Button
                onClick={onReset}
                variant="ghost"
                className="hover:bg-muted/80 h-7 rounded-[99px] px-3 py-0 text-[13px] font-normal transition-colors"
              >
                {resetText}
              </Button>
              <Button
                onClick={onSave}
                className={cn(
                  "h-7 rounded-[99px] px-3 py-0 text-[13px] font-medium",
                  "text-white",
                  "bg-gradient-to-b from-violet-500 to-violet-600",
                  "hover:from-violet-400 hover:to-violet-500",
                  "dark:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2)]",
                  "shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4)]",
                  "transition-all duration-200",
                )}
              >
                {saveText}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
