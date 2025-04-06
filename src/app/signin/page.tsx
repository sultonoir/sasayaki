import { LoginForm } from "@/components/form/signin/signin-form";
import { Toaster } from "@/components/ui/sonner";
import { GalleryVerticalEnd } from "lucide-react";

import Image from "next/image";

export default function LoginPage() {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Sasayaki.
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden place-items-center lg:grid">
          <div className="relative aspect-square size-96">
            <Image
              src="/logo.png"
              alt="Image"
              fill
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </>
  );
}
