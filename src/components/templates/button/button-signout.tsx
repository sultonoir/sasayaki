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
import { signoutAction } from "@/server/auth/signout/signout.action";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import { APP_TITLE } from "@/lib/constants";
import { ButtonLoading } from "./button-loading";
import { LogOut } from "lucide-react";

export const SignoutButton = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await signoutAction();
      toast("Signed out successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, {
          icon: (
            <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
          ),
        });
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3 w-full"
          title="Bookmarks">
          <LogOut />
          <span className="hidden lg:inline">Signout</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Sign out from {APP_TITLE}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be redirected to the home page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <ButtonLoading
            loading={isLoading}
            onClick={handleSignout}>
            Continue
          </ButtonLoading>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
