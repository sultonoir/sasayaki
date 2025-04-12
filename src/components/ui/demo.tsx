"use client";
import React from "react";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animate-modal";
import { Button } from "@/components/ui/button";
import UserProfile from "../user/user-profile";

export function AnimatedModalDemo() {
  return (
    <div className="flex items-center justify-center py-40">
      <ModalTrigger asChild>
        <Button
          variant="default"
          className="group/modal-btn relative bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <span className="text-center transition duration-500 group-hover/modal-btn:translate-x-40">
            Book your flight
          </span>
          <div className="absolute inset-0 z-20 flex -translate-x-40 items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0 dark:text-black">
            ✈️
          </div>
        </Button>
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <UserProfile />
        </ModalContent>
        <ModalFooter className="gap-4">
          <Button
            variant="secondary"
            className="w-28 border border-gray-300 bg-gray-200 text-black dark:border-black dark:bg-black dark:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="w-28 border border-black bg-black text-white dark:bg-white dark:text-black"
          >
            Book Now
          </Button>
        </ModalFooter>
      </ModalBody>
    </div>
  );
}
