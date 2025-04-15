import { ConvexError } from "convex/values";
import { toast } from "sonner";
import ErrorToast from "@/components/ui/error-toast";

export const handleError = ({
  error,
  message,
}: {
  error: unknown;
  message: string;
}) => {
  let defaultMessage = message;
  if (error instanceof ConvexError) {
    defaultMessage = error.data;
  }
  return toast.custom((t) => ErrorToast({ t, name: defaultMessage }));
};
