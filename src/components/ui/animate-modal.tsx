"use client";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import React, { ReactNode, useEffect, useRef } from "react";
import { Button } from "./button";

export const ModalTrigger = ({
  children,
  className,
  asChild,
}: {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}) => {
  const { setOpen } = useModal();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      onClick={setOpen}
      className={cn(
        "relative overflow-hidden rounded-md px-4 py-2 text-center text-black dark:text-white",
        className,
      )}
    >
      {children}
    </Comp>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const modalRef = useRef<HTMLDivElement | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center [perspective:800px] [transform-style:preserve-3d]"
        >
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              "relative z-50 flex max-h-[90%] min-h-[50%] flex-1 flex-col overflow-hidden border border-transparent bg-white md:max-w-4xl md:rounded-2xl dark:border-neutral-800 dark:bg-neutral-950",
              className,
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-1 flex-col p-8 md:p-10", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end bg-gray-100 p-4 dark:bg-neutral-900",
        className,
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={`bg-opacity-50 fixed inset-0 z-50 h-full w-full bg-black ${className}`}
    ></motion.div>
  );
};

const CloseIcon = () => {
  const { toggle } = useModal();
  const { state } = useProfileEdit();

  const handleToggle = () => {
    if (state.toast !== undefined) return;
    toggle();
  };
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="group absolute top-4 right-4 rounded-full"
    >
      <XIcon />
    </Button>
  );
};

// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
// export function useClickOutside(
//   ref: RefObject<HTMLDivElement | null>,
//   handler: () => void,
// ) {
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (ref?.current && !ref.current.contains(event.target as Node)) {
//         handler();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [ref, handler]);
// }
