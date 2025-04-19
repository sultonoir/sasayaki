import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import React from "react";

const FieldUsername = () => {
  const { state, dispatch } = useProfileEdit();

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
            let newValue = e.target.value;

            newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
            newValue = newValue.replace(/\s+/g, "");
            newValue = newValue.replace(/-+/g, "");
            if (newValue.length < 32) {
              dispatch({
                type: "SET_USERNAME",
                payload: newValue.toLowerCase(),
              });
              dispatch({ type: "SET_TOAST", payload: "initial" });
            }
          }}
          type="text"
          required
        />
      </div>
    </div>
  );
};

export default FieldUsername;
