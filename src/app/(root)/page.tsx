import { DemoImage } from "@/components/ui/image-upload";
import React from "react";

const Page = () => {
  return (
    <div className="grid min-h-[calc(100svh-110px)] place-items-center">
      <div className="max-w-lg">
        <DemoImage />
      </div>
    </div>
  );
};

export default Page;
