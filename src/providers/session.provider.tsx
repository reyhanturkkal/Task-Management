"use client";

import { useUserStore } from "@/store/useUserStore";
import { PropsWithChildren, useEffect } from "react";

const SessionProvider = (props: PropsWithChildren<unknown>) => {
  const checkToken = useUserStore((state) => state.checkToken);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return <>{props.children}</>;
};

export default SessionProvider;
