"use client";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
    <div data-testid="login-page" className="w-full md:max-w-[95%] mx-auto">
      <div className="mb-5 rounded-3xl border border-white/60 bg-white/35 p-5 text-center backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d2b11]">
          STUDENT HUB
        </p>
        <h1 className="pt-2 text-[2rem] font-black leading-tight tracking-tight text-gray-900">
          Pull up, your campus feed is waiting ✨
        </h1>
        <p className="pt-2 text-lg text-gray-700">
          Log in to catch updates, gigs, events &amp; notes in one spot.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-3 flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-[15px] font-semibold text-primary">
            Email
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
            placeholder="you@school.edu"
            className="h-14 w-full rounded-2xl border border-black/10 bg-white/55 px-4 text-lg transition-all focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-200/70"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-[15px] font-semibold text-primary">
              Password
            </label>
            <a href="#" className="text-sm font-semibold text-[#7d2b11] hover:underline">
              Forgot?
            </a>
          </div>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            placeholder="••••••••"
            className="h-14 w-full rounded-2xl border border-black/10 bg-white/55 px-4 text-lg transition-all focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-200/70"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {apiError && <p className="text-center text-sm text-red-500">{apiError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-14 w-full rounded-2xl border border-white/30 bg-gradient-to-r from-[#f27d45] via-[#cc4ca0] to-[#7e2bd0] font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_12px_30px_rgba(143,52,205,0.35)] disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Enter Hub →"}
        </button>
      </form>

      <p className="pt-3 text-center text-sm text-[#808080]">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-orange-600 transition-all duration-300 hover:underline"
        >
          Create one in 2 mins
        </Link>
      </p>

      <div className="my-5 flex items-center justify-center md:my-8">
        <div className="h-px w-full bg-gray-300"></div>
        <span className="mx-2 text-xs uppercase tracking-[0.2em] text-gray-500">
          OR VIBE-CHECK WITH
        </span>
        <div className="h-px w-full bg-gray-300"></div>
      </div>

      <div className="flex items-center justify-center gap-[13px] text-sm font-semibold leading-4 text-[#FCFCFC] max-sm:flex-col">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 py-3.5 text-[#FCFCFC] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors hover:bg-black"
          aria-label="Login with google"
          data-testid="login-link"
        >
          <span>Google</span>
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 py-3.5 text-[#FCFCFC] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors hover:bg-black"
          aria-label="Login with apple"
          data-testid="login-link"
        >
          <span>Apple</span>
        </button>
      </div>
    </div>
  );
}
