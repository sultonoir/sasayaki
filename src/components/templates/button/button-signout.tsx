"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { APP_TITLE } from "@/lib/constants";
import { ButtonLoading } from "./button-loading";
import { LogOut } from "lucide-react";
import { logout } from "@/server/api/routers/auth/auth.service";

export const SignoutButton = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast("Signed out successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start gap-3"
          title="Bookmarks"
        >
          <LogOut />
          <span className="hidden lg:inline">Signout</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Sign out from {APP_TITLE}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be redirected to the signin page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <ButtonLoading loading={isLoading} onClick={handleSignout}>
            Continue
          </ButtonLoading>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
