import { Link, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import UnivyxLogo from "../assets/images/univyx-logo.svg";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1ff] via-[#f4edff] to-[#fdeeff] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.16] [background-image:linear-gradient(to_right,rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:48px_48px]"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-72 h-72 bg-[#ffbfd3] rounded-full blur-3xl opacity-35 animate-blob"></div>
        <div className="absolute top-32 right-8 w-72 h-72 bg-[#bfa8ff] rounded-full blur-3xl opacity-35 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-[#d0b5ff] rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/80 rounded-full animate-float opacity-70"></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-white/80 rounded-full animate-float animation-delay-2000 opacity-70"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform">
            <img
              src={UnivyxLogo}
              alt="Univyx logo"
              className="h-20 mx-auto drop-shadow-lg"
            />
          </Link>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Welcome back! 👋
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Let's get you back to the action
          </p>
        </div>
        
        <div className="bg-white/45 backdrop-blur-2xl rounded-3xl shadow-[0_18px_60px_rgba(94,72,173,0.25)] p-8 border border-white/55">
          <Login />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            New here? 🚀{" "}
            <Link
              to="/signup"
              className="font-bold text-orange-600 hover:text-orange-500 transition-colors underline decoration-wavy"
            >
              Join the community
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
