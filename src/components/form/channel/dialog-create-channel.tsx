"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormCreateChannel } from "./form-create-channel";
import { useDialogCreateChannel } from "@/hooks/use-dialog-create-channel";

export default function DrawerDialogDemo() {
  const { open, setOpen } = useDialogCreateChannel();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
            <DialogDescription>in Text Channels</DialogDescription>
          </DialogHeader>
          <FormCreateChannel />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Channel</DrawerTitle>
          <DrawerDescription>in Text Channels</DrawerDescription>
        </DrawerHeader>
        <FormCreateChannel className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
