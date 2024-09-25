"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const Navbar = () => {
  const { token, signOut,  } = useUserStore();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      if (response.ok) {
        signOut();
        localStorage.removeItem("accessToken");
        router.push("/");
      } else {
        console.error("Sign out failed");
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header>
    <div className="flex items-center justify-between bg-gray-800 p-4">
      <div className="text-white text-xl font-bold">Task App</div>
      <nav className="flex items-center space-x-4 text-white">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/tasks" className="hover:underline">
          Tasks
        </Link>

        {token ? (
          <>
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
            <button onClick={handleSignOut} className="hover:underline">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="hover:underline">
              Sign In
            </Link>
            <Link href="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </div>
    </header>
  );
};

export default Navbar;
