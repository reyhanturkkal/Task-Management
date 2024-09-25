"use client";

import { useUserStore } from "@/store/useUserStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

const RouteProtection = (props: PropsWithChildren<unknown>) => {
  const token = useUserStore((state) => state.token);
  const tasks = useTaskStore((state) => state.tasks);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/signin");
    }
  }, [token, tasks.length, router]);

  return <>{props.children}</>;
};

export default RouteProtection;
