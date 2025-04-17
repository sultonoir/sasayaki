import { SigninForm } from "@/components/form/signin/signin-form";
import { Toaster } from "@/components/ui/sonner";
import { Image } from "@unpic/react/nextjs";
import { GalleryVerticalEnd } from "lucide-react";

export default function LoginPage() {
  return (
    <>
      <div className="grid min-h-svh overflow-hidden lg:grid-cols-2">
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
              <SigninForm />
            </div>
          </div>
        </div>
        <div className="bg-card relative hidden place-items-center lg:grid lg:grid-cols-2 lg:grid-rows-[1fr_2fr]">
          <div className="col-span-2 flex size-full flex-col items-center justify-center px-10 text-7xl font-bold">
            Start chatting with your friends.
          </div>

          <div className="absolute right-0 bottom-0 h-[700px]">
            <div className="size-full overflow-hidden rounded-tl-xl">
              <Image
                src="/1.png"
                alt="Image"
                width={796}
                height={921}
                priority={true}
                loading="eager"
                layout="constrained"
                className="size-full object-contain dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </>
  );
}
