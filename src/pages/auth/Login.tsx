"use client";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface FormData {
  email: string;
  password: string;
}

function IntroCard() {
  return (
    <section className="mb-5 rounded-3xl border border-white/45 bg-white/20 p-5 text-center backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ffe1c6]">
        STUDENT HUB
      </p>
      <h1 className="pt-2 text-[2rem] sm:text-[2.25rem] font-black leading-tight tracking-tight text-white">
        Access the elite campus network now ✨
      </h1>
      <p className="pt-2 text-base text-white/85">
        {"Log in to catch updates, gigs, events & notes in one spot."}
      </p>
    </section>
  );
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
      <IntroCard />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-3 flex flex-col gap-5">
        <div className="relative">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
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
            className="h-14 w-full rounded-2xl border border-white/35 bg-white/20 px-4 text-base text-white placeholder:text-white/60 transition-all focus:border-[#9ad3ff] focus:outline-none focus:ring-4 focus:ring-[#a695ff]/40"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
              Password
            </label>
            <a href="#" className="text-sm font-semibold text-[#ffe2ca] hover:text-white hover:underline">
              Forgot?
            </a>
          </div>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            placeholder="••••••••"
            className="h-14 w-full rounded-2xl border border-white/35 bg-white/20 px-4 text-base text-white placeholder:text-white/60 transition-all focus:border-[#9ad3ff] focus:outline-none focus:ring-4 focus:ring-[#a695ff]/40"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {apiError && <p className="text-center text-sm text-red-500">{apiError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-14 w-full rounded-2xl border border-white/30 font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_12px_35px_rgba(102,78,255,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200/80 disabled:opacity-50 bg-[length:220%_220%] animate-btn-gradient"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="pt-3 text-center text-sm text-white/80">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-[#ffe2ca] transition-all duration-300 hover:text-white hover:underline"
        >
          Create one in 2 mins
        </Link>
      </p>

      <div className="my-5 flex items-center justify-center md:my-8">
        <div className="h-px w-full bg-white/25"></div>
        <span className="mx-2 text-xs uppercase tracking-[0.2em] text-white/65">
          OR VIBE-CHECK WITH
        </span>
        <div className="h-px w-full bg-white/25"></div>
      </div>

      <div className="flex items-center justify-center gap-[13px] text-sm font-semibold leading-4 text-[#FCFCFC] max-sm:flex-col">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-[#0f1020]/80 py-3.5 text-[#FCFCFC] shadow-[0_8px_24px_rgba(8,10,30,0.4)] transition-all hover:bg-black/80 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200/70"
          aria-label="Login with google"
          data-testid="login-link"
        >
          <span>Google</span>
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-[#0f1020]/80 py-3.5 text-[#FCFCFC] shadow-[0_8px_24px_rgba(8,10,30,0.4)] transition-all hover:bg-black/80 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200/70"
          aria-label="Login with apple"
          data-testid="login-link"
        >
          <span>Apple</span>
        </button>
      </div>
      <style>{`
        @keyframes buttonGradient {
          0% { background-position: 0% 50%; background-image: linear-gradient(110deg, #3b1f87, #324ec7, #257f84, #b98b70); }
          50% { background-position: 100% 50%; background-image: linear-gradient(110deg, #4a27a1, #2a5ddc, #2c8b7b, #c79d84); }
          100% { background-position: 0% 50%; background-image: linear-gradient(110deg, #3b1f87, #324ec7, #257f84, #b98b70); }
        }
        .animate-btn-gradient {
          animation: buttonGradient 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
