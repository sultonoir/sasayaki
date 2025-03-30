import React, { useEffect } from "react";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "@/hooks/use-session";

const SessionProvider = () => {
  const { data } = useQuery(api.user.user_service.getMe);
  const { setSession } = useSession();
  useEffect(() => {
    setSession(data);
  }, [data, setSession]);
  return <div className="sr-only">Sasayaki.</div>;
};

export default SessionProvider;
