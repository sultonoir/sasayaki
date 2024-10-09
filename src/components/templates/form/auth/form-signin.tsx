"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { InputPassword } from "../../input/input-password";
import { ButtonLoading } from "../../button/button-loading";
import { APP_TITLE } from "@/lib/constants";
import { SigninFormSchema } from "@/server/api/routers/auth/auth.input";
import { useMutation } from "@tanstack/react-query";
import { signin } from "@/server/api/routers/auth/auth.service";

export function FormSignin() {
  const form = useForm<SigninFormSchema>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationKey: ["signin"],
    mutationFn: async (data: SigninFormSchema) => {
      return await signin(data);
    },
    onSuccess: () => {
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(data: SigninFormSchema) {
    mutate(data);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{APP_TITLE} Sign in</CardTitle>
        <CardDescription>Sign in to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap justify-between">
                <Button
                  variant={"link"}
                  size={"sm"}
                  className="p-0 text-sm text-foreground"
                  asChild
                >
                  <Link href={"/signup"}>
                    Don&apos;t have an account? Sign up
                  </Link>
                </Button>
              </div>
              <ButtonLoading
                className="w-full"
                type="submit"
                loading={isPending}
              >
                Submit
              </ButtonLoading>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                asChild
              >
                <Link href="/">Cancel</Link>
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
