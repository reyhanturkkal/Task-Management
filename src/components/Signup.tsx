"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  username: yup.string().required("Kullanıcı adı gereklidir"),
  email: yup
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .required("E-posta adresi gereklidir"),
  password: yup
    .string()
    .min(4, "Şifre en az 4 karakter olmalıdır")
    .required("Şifre gereklidir"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifreyi doğrulamanız gereklidir"),
});

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kayıt başarısız");
      }

      const result = await response.json();
      console.log("Signup response:", result);

      router.push("/signin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message ||
            "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin."
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
          Kayıt Ol
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Şifreyi Doğrula
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
