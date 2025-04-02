import React from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

interface Props {
  name: string;
  t?: string | number;
}

const ErrorToast = ({ t, name }: Props) => {
  return (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleAlert
            className="mt-0.5 shrink-0 text-red-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{name}</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
          className="h-7"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ErrorToast;
