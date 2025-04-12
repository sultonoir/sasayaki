"use client";
import React from "react";
import { ModalBody, ModalContent } from "@/components/ui/animate-modal";
import UserProfile from "@/components/user/user-profile";
import { useModal } from "@/hooks/use-modal";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileEdit } from "@/provider/profile-edit-provider";

export default function EditProfileDialog() {
  const isMobile = useIsMobile();
  const { open, toggle } = useModal();
  const { state } = useProfileEdit();

  const handleToggle = () => {
    if (state.toast !== undefined) return;
    toggle();
  };
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleToggle}>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <UserProfile />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <ModalBody>
      <ModalContent>
        <UserProfile />
      </ModalContent>
    </ModalBody>
  );
}
