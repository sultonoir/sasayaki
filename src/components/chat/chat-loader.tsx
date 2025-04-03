import React from "react";
import { Skeleton } from "../ui/skeleton";

const ChatLoader = ({ length = 14 }: { length?: number }) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {Array.from({ length }).map((_, index) => (
        <div className="flex items-center space-x-4" key={index}>
          <Skeleton className="h-12 w-12 flex-none rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatLoader;
