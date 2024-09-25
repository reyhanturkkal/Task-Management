import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/useUserStore";
import { useTaskStore } from "@/store/useTaskStore";

const SignoutPage = () => {
  const router = useRouter();
  const signout = useUserStore((state) => state.signOut);
  const taskDelete = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    const signOut = async () => {
      try {
        const response = await fetch("/api/auth/signout", {
          method: "POST",
        });

        if (response.ok) {
          taskDelete([]);
          signout();

          router.push("/");
        } else {
          console.error("Sign out failed");
        }
      } catch (error) {
        console.error("Sign out error:", error);
      }
    };

    signOut();
  }, [router]);

  return <div>Signing out...</div>;
};

export default SignoutPage;
