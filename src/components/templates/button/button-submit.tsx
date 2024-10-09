"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import type { ButtonProps } from "@/components/ui/button";
import { ButtonLoading } from "./button-loading";

const ButtonSubmit = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { pending } = useFormStatus();
    return (
      <ButtonLoading
        ref={ref}
        {...props}
        loading={pending}
        className={className}>
        {children}
      </ButtonLoading>
    );
  }
);
ButtonSubmit.displayName = "ButtonSubmit";

export { ButtonSubmit };
