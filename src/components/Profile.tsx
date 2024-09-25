"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

interface ProfileFormValues {
  username: string;
  email: string;
  password?: string;
}

export default function Profile() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(schema),
  });
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const user = data.user;
          setValue("username", user.username);
          setValue("email", user.email);
        } else if (res.status === 401) {
          router.push("/signin");
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("An error occurred", error);
      }
    };

    fetchProfile();
  }, [setValue, router]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const profileRes = await fetch("/api/auth/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!profileRes.ok) {
        console.error("Failed to fetch profile for ID");
        return;
      }

      const profileData = await profileRes.json();
      const userId = profileData.user._id;

      const res = await fetch(`/api/auth/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log("Profile updated successfully");
        router.push("/profile");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("An error occurred while updating the profile", error);
    }
  };

  const handleDelete = async () => {
    try {
      const profileRes = await fetch("/api/auth/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!profileRes.ok) {
        console.error("Failed to fetch profile for ID");
        return;
      }

      const profileData = await profileRes.json();
      const userId = profileData.user._id;

      const res = await fetch(`/api/auth/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        console.log("User deleted successfully");
        localStorage.removeItem("accessToken");
        router.push("/signin");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("An error occurred while deleting the user", error);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 my-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Profile
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            {...register("username")}
            className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            {...register("email")}
            className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded transition hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white py-2 px-4 rounded mt-4 transition hover:bg-red-600"
      >
        Delete Account
      </button>
    </div>
  );
}
