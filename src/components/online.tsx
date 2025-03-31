"use client";

import { api } from "@/convex/_generated/api";
import { useSession } from "@/hooks/use-session";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";

const OnlineStatus: React.FC = () => {
  const {user} = useSession()
  return (
    <div>
      {user?.name}
    </div>
  );
};

export default OnlineStatus;
