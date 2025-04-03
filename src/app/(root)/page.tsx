import Demo from "@/components/ui/demo";
import React from "react";

const Page = () => {
  return (
    <div className="relative">
      <div style={{ position: "absolute", width: "100%" }}>
        <Demo />
      </div>
    </div>
  );
};

export default Page;
