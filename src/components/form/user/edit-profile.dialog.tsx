"use client";
import React, { useEffect } from "react";
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
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { useServerProfile } from "@/hooks/use-server-profile";
import ServerUserProfile from "@/components/server/server-user-profile";

export default function EditProfileDialog() {
  const isMobile = useIsMobile();
  const { open, toggle } = useModal();
  const { state } = useProfileEdit();
  const { status, setServers } = useServerProfile();
  const isDisabled = state.toast !== undefined || status !== undefined;
  const { data } = useQuery(api.server.server_service.getMyServer);
  const handleToggle = () => {
    if (isDisabled) return;
    toggle();
  };

  useEffect(() => {
    setServers(data || []);
  }, [data, setServers]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleToggle}>
        <AnimatedTabs.Root defaultTab="tab1" className="flex-1">
          <DrawerContent>
            <DrawerHeader>
              <AnimatedTabs.List>
                <AnimatedTabs.Trigger disabled={isDisabled} id="tab1">
                  Profile
                </AnimatedTabs.Trigger>
                <AnimatedTabs.Trigger disabled={isDisabled} id="tab2">
                  Per-server profiles
                </AnimatedTabs.Trigger>
              </AnimatedTabs.List>
              <DrawerTitle className="sr-only">
                change profile and profile per-server
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <AnimatedTabs.Content
              id="tab1"
              className="flex max-h-[80%] flex-1 flex-col overflow-y-auto"
            >
              <UserProfile />
            </AnimatedTabs.Content>
            <AnimatedTabs.Content
              id="tab2"
              className="flex max-h-[80%] min-h-[50rem] flex-1 flex-col overflow-y-auto"
            >
              <ServerUserProfile servers={data || []} />
            </AnimatedTabs.Content>
          </DrawerContent>
        </AnimatedTabs.Root>
      </Drawer>
    );
  }

  return (
    <ModalBody>
      <ModalContent>
        <AnimatedTabs.Root defaultTab="tab1" className="flex-1 overflow-hidden">
          <AnimatedTabs.List>
            <AnimatedTabs.Trigger disabled={isDisabled} id="tab1">
              Profile
            </AnimatedTabs.Trigger>
            <AnimatedTabs.Trigger disabled={isDisabled} id="tab2">
              Per-server profiles
            </AnimatedTabs.Trigger>
          </AnimatedTabs.List>
          <AnimatedTabs.Content id="tab1">
            <UserProfile />
          </AnimatedTabs.Content>
          <AnimatedTabs.Content id="tab2">
            <ServerUserProfile servers={data || []} />
          </AnimatedTabs.Content>
        </AnimatedTabs.Root>
      </ModalContent>
    </ModalBody>
  );
}
