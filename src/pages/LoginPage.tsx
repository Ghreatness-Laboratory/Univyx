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
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_25%_35%,rgba(255,194,164,0.35),transparent_45%),radial-gradient(circle_at_78%_64%,rgba(188,154,255,0.35),transparent_42%),linear-gradient(135deg,#f2eff9_0%,#f6f1f9_48%,#efe9ff_100%)]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:3px_3px]"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-8 sm:left-16 w-80 h-80 bg-orange-200/60 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-4 sm:right-16 w-96 h-96 bg-violet-300/45 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-24 left-1/3 w-80 h-80 bg-pink-200/55 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 border-b border-black/10 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center">
            <img
              src={UnivyxLogo}
              alt="Univyx logo"
              className="h-8 w-auto"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-12 text-lg font-medium tracking-tight text-black/85">
            <Link to="/">Explore</Link>
            <Link to="/">Community</Link>
            <Link to="/">Resources</Link>
          </nav>
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/login" className="text-base font-semibold text-black/90">Login</Link>
            <Link to="/signup" className="rounded-full px-6 py-2 text-base font-semibold text-white bg-[#a84d0d] border border-black/20 shadow-sm hover:brightness-110 transition">Join Us</Link>
          </div>
          <button className="sm:hidden p-2 rounded-lg border border-black/15 bg-white/70" aria-label="Open menu">
            <span className="block w-5 h-0.5 bg-black mb-1"></span>
            <span className="block w-5 h-0.5 bg-black mb-1"></span>
            <span className="block w-5 h-0.5 bg-black"></span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center">
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

        <div className="w-full max-w-md sm:max-w-[480px] mt-8 sm:mt-10 bg-white/55 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(61,35,112,0.20)] p-5 sm:p-8 border border-white/70">
          <Login />
        </div>

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

      <footer className="relative z-10 mt-10 border-t border-black/10 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <img src={UnivyxLogo} alt="Univyx logo" className="h-6 w-auto mb-3" />
            <p className="text-base text-black/60">© 2024 Univyx. The Digital Campus.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-black/80">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>

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
      `}</style>
    </div>
  );
}
