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

function IntroCard() {
  return (
    <section className="mb-5 rounded-3xl border border-white/60 bg-white/35 p-5 text-center backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d2b11]">
        PRIVATE UNIVERSITY HUB
      </p>
      <h1 className="pt-2 text-[2rem] font-black leading-tight tracking-tight text-gray-900">
        Access the elite campus network now
      </h1>
      <p className="pt-2 text-lg text-gray-700">
     Log in to discover the finest campus updates, gists, events & games
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
    <div data-testid="login-page" className="w-full max-w-md mx-auto px-4 py-8">
      <IntroCard />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            })}
            placeholder="you@school.edu"
            className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {apiError && <p className="text-center text-sm text-red-500">{apiError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-70 transition-colors text-white font-semibold py-3.5 rounded-2xl text-lg"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-[#808080] text-sm text-center pt-6">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-orange-600 font-semibold hover:underline transition-all duration-300"
        >
          Create one in 2 mins
        </Link>
      </p>

      <div className="flex items-center justify-center my-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-4 text-xs text-gray-500 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          className="flex gap-2 items-center justify-center py-3.5 rounded-xl w-full bg-gray-900 text-white border border-gray-700 hover:bg-black transition-colors"
          aria-label="Login with Google"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
            {/* Google SVG paths (kept from your original) */}
            <path d="M6.84492 2.39642C8.09951 2.39642 9.24812 2.84084 10.1505 3.57827L9.0405 4.68827C8.42844 4.23054 7.66939 3.95698 6.84492 3.95698C4.81347 3.95698 3.16645 5.604 3.16645 7.63544C3.16645 9.66689 4.81347 11.3139 6.84492 11.3139C8.44717 11.3139 9.80488 10.2882 10.31 8.86175L10.4679 8.41572H9.99474H7.17932V6.85516H11.5266V6.87829H11.861H12.0283C12.0646 7.12592 12.0839 7.37862 12.0839 7.63544C12.0839 10.5287 9.73816 12.8745 6.84492 12.8745C3.95168 12.8745 1.60589 10.5287 1.60589 7.63544C1.60589 4.7422 3.95168 2.39642 6.84492 2.39642Z" fill="#FBC02D" stroke="#FCFCFC" strokeWidth="0.668812"/>
            {/* ... rest of Google SVG (you can keep your original) */}
          </svg>
          Continue with Google
        </button>

        <button
          className="flex gap-2 items-center justify-center py-3.5 rounded-xl w-full bg-gray-900 text-white border border-gray-700 hover:bg-black transition-colors"
          aria-label="Login with Apple"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            {/* Apple SVG */}
          </svg>
          Continue with Apple
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
