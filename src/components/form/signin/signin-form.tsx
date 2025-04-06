"use client";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { handleError } from "@/lib/handle-eror";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { signIn } = useAuthActions();
  const [isPending, setisPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setisPending(true);
    await signIn("google", {
      redirectTo: "/",
    });
    setisPending(false);
  };

  const handleSignin = async () => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: process.env.NEXT_PUBLIC_DEMO_EMAIL!,
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD!,
        flow: "signIn",
        redirectTo: "/",
      });
    } catch (error) {
      setIsLoading(false);
      return handleError({ error, message: "Error signin" });
    }

    setisPending(false);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">Sasayaki.</span>
          </a>
          <h1 className="text-xl font-bold">Welcome to Sasayaki.</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          <Button onClick={handleSignin} disabled={isLoading}>
            Signin with demo account
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={isPending}
            loading={isPending}
            onClick={handleClick}
            startContent={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            Continue with Google
          </Button>
        </div>
      </div>
      <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
