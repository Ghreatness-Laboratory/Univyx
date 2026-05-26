"use client";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setApiError(null);
      await login(data.email, data.password);
      navigate("/", { replace: true });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Login failed. Please try again.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-testid="login-page"
      className="w-full mx-auto bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_18px_50px_rgba(15,23,42,0.12)] border border-gray-100"
    >
      <div className="flex justify-center mb-5">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-orange-50 border border-orange-100">
          <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
          <span className="text-[11px] tracking-[0.14em] font-bold text-primary">
            STUDENT HUB
          </span>
        </div>
      </div>

      <h1 className="text-center text-3xl sm:text-[2.1rem] font-bold leading-tight text-gray-900">
        Access the elite campus network now ✨
      </h1>
      <p className="text-center mt-3 text-sm sm:text-base text-gray-600 max-w-[520px] mx-auto">
        Login to discover the finest campus updates, gists, events & games in a
        single premium network
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5 pt-7"
      >
        <div>
          <label className="block text-[13px] text-gray-700 font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            })}
            placeholder="name@university.edu"
            className="w-full h-12 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[13px] text-gray-700 font-semibold">
              Password
            </label>
            <a href="#" className="text-xs font-semibold text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="••••••••"
              className="w-full h-12 pl-4 pr-11 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              <Eye size={18} />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary font-semibold text-white h-12 mt-1 rounded-xl disabled:opacity-50 hover:brightness-105 transition-all"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="flex items-center justify-center my-6">
        <div className="w-full h-px bg-gray-200"></div>
        <span className="mx-3 text-gray-400 text-xs font-semibold tracking-[0.18em]">
          OR
        </span>
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      <button
        className="flex gap-2 items-center justify-center h-12 rounded-xl w-full bg-gray-900 text-white border border-gray-800 shadow-sm hover:bg-black transition-colors text-sm font-semibold"
        aria-label="Continue with google"
        data-testid="login-link"
      >
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-900 text-[10px] font-bold">
          G
        </span>
        <span>Continue with Google</span>
      </button>

      <p className="text-gray-600 text-sm text-center pt-5">
        New to the elite circle?{" "}
        <Link
          to="/signup"
          className="text-primary font-semibold hover:underline transition-all duration-300"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
