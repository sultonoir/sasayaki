"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { User2 } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import ErrorToast from "@/components/ui/error-toast";
import { Input } from "@/components/ui/input";
import { handleError } from "@/lib/handle-eror";

export function SigninForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [isPending, setisPending] = useState(false);
  const { signIn } = useAuthActions();

  /**
   * handle guest
   *
   */
  const handleGuest = async () => {
    try {
      setisPending(true);
      await signIn("password", {
        email: process.env.NEXT_PUBLIC_DEMO_EMAIL!,
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD!,
        flow: "signUp",
      });
    } catch (error) {
      setisPending(false);
      return handleError({ error, message: "signin" });
    }
    setisPending(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("password", formData);
    } catch (error) {
      let toastTitle: string;
      if (error instanceof ConvexError && error.data === "INVALID_PASSWORD") {
        toastTitle = "Invalid password - check the requirements and try again.";
      } else {
        toastTitle =
          flow === "signIn"
            ? "Could not sign in, did you mean to sign up?"
            : "Could not sign up, did you mean to sign in?";
      }
      setSubmitting(false);
      return toast.custom((t) => <ErrorToast name={toastTitle} t={t} />);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex items-center justify-center rounded-md">
            <Image src="/logo.png" alt="logo" width={50} height={50} priority />
          </div>
          <span className="sr-only">Sasayaki.</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to Sasayaki.</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-1">
        <Button
          startContent={<User2 />}
          disabled={isPending}
          onClick={handleGuest}
          className="w-full"
        >
          Continue with Guest
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => signIn("google")}
          className="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Continue with Google
        </Button>
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Or
        </span>
      </div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <Input
          name="email"
          id="email"
          className="mb-4"
          autoComplete="email"
          placeholder="hi@rainame.com"
        />
        <div className="flex items-center justify-between">
          <label htmlFor="password">Password</label>
        </div>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          autoComplete={flow === "signIn" ? "current-password" : "new-password"}
        />

        <input name="flow" value={flow} type="hidden" />
        <Button type="submit" disabled={submitting} className="mt-4">
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </Button>
        <Button
          variant="link"
          type="button"
          onClick={() => {
            setFlow(flow === "signIn" ? "signUp" : "signIn");
          }}
        >
          {flow === "signIn"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </Button>
      </form>
    </div>
  );
}
