import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import { useSession } from "@/provider/session-provider";
import { useQuery } from "convex-helpers/react";
import { CheckIcon, Loader2, XIcon } from "lucide-react";
import React from "react";

const FieldUsername = () => {
  const { user } = useSession();
  const { state, dispatch } = useProfileEdit();
  const debouncedUsername = useDebounce(state.username, 500);

  const { isPending, isError, data } = useQuery(
    api.user.user_service.searchUsername,
    {
      username:
        debouncedUsername.length > 0 && debouncedUsername !== user?.username
          ? debouncedUsername
          : "skip",
    },
  );
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <div className="relative">
        <Input
          id="username"
          className="peer pe-9"
          placeholder="Username"
          value={state.username}
          onChange={(e) => {
            dispatch({ type: "SET_USERNAME", payload: e.target.value });
            dispatch({ type: "SET_TOAST", payload: "initial" });
          }}
          type="text"
          required
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
          <UsernameStatus
            debouncedUsername={debouncedUsername}
            isPending={isPending}
            isError={isError}
            data={data}
          />
        </div>
      </div>
    </div>
  );
};

interface UsernameStatusProps {
  isPending: boolean;
  isError: boolean;
  data: boolean | undefined;
  debouncedUsername: string;
}
const UsernameStatus = ({
  isError,
  isPending,
  data,
  debouncedUsername,
}: UsernameStatusProps) => {
  if (isPending) return <Loader2 className="animate-spin" />;
  if (!data || isError)
    return <XIcon size={16} className="text-rose-500" aria-hidden="true" />;
  if (debouncedUsername.length === 0) {
    return null;
  }
  return (
    <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
  );
};

export default FieldUsername;
