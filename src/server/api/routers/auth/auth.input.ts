import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  username: z
    .string()
    .min(2, { message: "Userame must be at least 2 characters long." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .trim(),
});

export const SigninFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Userame must be at least 2 characters long." }),
  password: z.string().min(1, { message: "Password field must not be empty." }),
});

export type SigninFormSchema = z.infer<typeof SigninFormSchema>;
export type SignupFormSchema = z.infer<typeof SignupFormSchema>;

export type FormState =
  | {
      errors?: {
        name?: string[];
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
