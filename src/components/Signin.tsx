"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .required("E-posta adresi gereklidir"),
  password: yup
    .string()
    .min(4, "Şifre en az 4 karakter olmalıdır")
    .required("Şifre gereklidir"),
});

interface SigninFormValues {
  email: string;
  password: string;
}

function Signin() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setAuthenticated = useUserStore((state) => state.setAuthenticated);

  const onSubmit = async (data: SigninFormValues) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Giriş başarısız");
      }

      const { token } = await response.json();
      setAuthenticated(token);

      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message ||
            "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin."
        );
      } else {
        setErrorMessage("Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Giriş Yap
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
