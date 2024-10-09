import NavMenu from "@/components/templates/navigation/navmenu";
import { Toaster } from "@/components/ui/sonner";
import { verifySession } from "@/helper/session";
import { SessionProvider } from "@/provider/session-provider";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await verifySession();
  return (
    <SessionProvider session={user}>
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-7xl grow">
          <div className="sticky top-2 z-50 hidden h-fit w-full flex-none space-y-3 border-border/40 bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:block lg:px-5 xl:w-80">
            <div className="lg:ml-auto lg:w-52">
              <NavMenu className="block space-y-3" />
            </div>
          </div>
          <div className="w-full">{children}</div>
          <NavMenu className="sticky top-2 z-50 hidden h-fit w-full flex-none space-y-3 border-border/40 bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:block lg:px-5 xl:w-80" />
        </div>
        <NavMenu className="sticky bottom-0 z-50 hidden h-fit w-full flex-none space-y-3 border-border/40 bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:block lg:px-5 xl:w-80" />
      </div>
      <Toaster position="bottom-center" richColors />
    </SessionProvider>
  );
};

export default Layout;
