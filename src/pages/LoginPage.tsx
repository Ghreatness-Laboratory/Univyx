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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[length:300%_300%] animate-luxe-gradient">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.14),transparent_42%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.1),transparent_35%)]"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(3,4,18,0.28)_85%)]"></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:52px_52px]"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-80 h-80 bg-[#ffba9f]/35 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-6 w-96 h-96 bg-[#53d1ca]/25 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-14 left-1/2 w-96 h-96 bg-[#8a5cff]/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#ffd4b8]/90 rounded-full animate-float opacity-80 shadow-[0_0_18px_rgba(255,212,184,0.9)]"></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-[#b8f6ff]/90 rounded-full animate-float animation-delay-2000 opacity-80 shadow-[0_0_18px_rgba(184,246,255,0.9)]"></div>
        <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-[#d6c2ff]/80 rounded-full animate-float animation-delay-4000 shadow-[0_0_16px_rgba(214,194,255,0.9)]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform">
            <img
              src={UnivyxLogo}
              alt="Univyx logo"
              className="h-24 sm:h-28 mx-auto drop-shadow-[0_0_24px_rgba(255,255,255,0.42)]"
            />
          </Link>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-sm">
            Welcome back! 👋
          </h2>
          <p className="mt-3 text-base text-white/85 tracking-wide">
            Let's get you back to the action
          </p>
        </div>
        
        <div className="bg-white/16 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_90px_rgba(9,6,30,0.58)] p-8 border border-white/30 animate-card-glow">
          <Login />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-white/90">
            New here? 🚀{" "}
            <Link
              to="/signup"
              className="font-bold text-[#ffd7bd] hover:text-white transition-colors underline decoration-wavy"
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
        @keyframes luxeGradient {
          0% { background: linear-gradient(120deg, #2d1260, #3447a8, #1f7f85, #b6896e); }
          50% { background: linear-gradient(120deg, #3c1f77, #2350bd, #287f74, #c39a7f); }
          100% { background: linear-gradient(120deg, #2d1260, #3447a8, #1f7f85, #b6896e); }
        }
        .animate-luxe-gradient {
          animation: luxeGradient 14s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes cardGlow {
          0%, 100% { box-shadow: 0 30px 90px rgba(9,6,30,0.58), 0 0 0 1px rgba(255,255,255,0.18); }
          50% { box-shadow: 0 32px 96px rgba(9,6,30,0.64), 0 0 0 1px rgba(165,149,255,0.4); }
        }
        .animate-card-glow {
          animation: cardGlow 7s ease-in-out infinite;
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
