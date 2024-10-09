import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <div className="hidden lg:block absolute top-0 right-0 w-full h-[510px] z-0">
        <div className="relative h-full">
          <Image
            src="/banner.webp"
            fill
            alt="banner"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="grid min-h-screen place-items-center p-4 relative">
        {children}
      </div>
      <Toaster
        position="bottom-center"
        richColors
      />
    </React.Fragment>
  );
};

export default AuthLayout;
