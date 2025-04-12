import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import React from "react";

const FieldName = () => {
  const { state, dispatch } = useProfileEdit();
  return (
    <div className="space-y-2">
      <Label htmlFor="first-name">Name</Label>
      <Input
        id="first-name"
        placeholder="Matt"
        value={state.name}
        onChange={(e) => {
          dispatch({ type: "SET_NAME", payload: e.target.value });
          dispatch({ type: "SET_TOAST", payload: "initial" });
        }}
        type="text"
        required
      />
    </div>
  );
};

export default FieldName;
