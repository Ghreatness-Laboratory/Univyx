import { Link, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import UnivyxLogo from "../assets/images/univyx-logo.svg";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ff]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a84d0d]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_25%_35%,rgba(255,194,164,0.35),transparent_45%),radial-gradient(circle_at_78%_64%,rgba(188,154,255,0.35),transparent_42%),linear-gradient(135deg,#f2eff9_0%,#f6f1f9_48%,#efe9ff_100%)]">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:3px_3px]"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-8 sm:left-16 w-80 h-80 bg-orange-200/60 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-4 sm:right-16 w-96 h-96 bg-violet-300/45 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-24 left-1/3 w-80 h-80 bg-pink-200/55 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16 min-h-screen">
        
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex p-2 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-sm shadow-sm">
            <img src={UnivyxLogo} alt="Univyx logo" className="h-7 w-auto" />
          </div>
          <h2 className="mt-6 text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Welcome back! 👋
          </h2>
          <p className="mt-3 text-lg text-gray-700">
            Let's get you back to the action
          </p>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md sm:max-w-[480px] bg-white/48 backdrop-blur-2xl rounded-[2rem] shadow-[0_18px_50px_rgba(61,35,112,0.24)] p-5 sm:p-8 border border-white/60">
          <Login />
        </div>

        {/* Sign up prompt */}
        <div className="text-center mt-10">
          <p className="text-2xl text-gray-800">
            New here? 🚀{" "}
            <Link
              to="/signup"
              className="font-bold text-[#7d2b11] hover:text-[#5f1f0d] transition-colors"
            >
              Join the community
            </Link>
          </p>
        </div>
      </main>

      {/* Optional Minimal Footer - Remove if you still see double footer */}
      {/* 
      <footer className="relative z-10 border-t border-black/10 bg-white/55 backdrop-blur-md py-6 text-center text-sm text-black/60">
        © 2024 Univyx. The Digital Campus.
      </footer>
      */}

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
