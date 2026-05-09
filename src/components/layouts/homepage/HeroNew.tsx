import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star, Zap, Users, GraduationCap, Calendar, Briefcase, Flag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background - MORE VIBRANT */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 animate-float">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute bottom-32 left-32 animate-float" style={{ animationDelay: '1s' }}>
          <Zap className="w-10 h-10 text-purple-500 fill-purple-500" />
        </div>
        <div className="absolute top-40 left-1/3 animate-float" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-full px-4 py-2 mb-6 shadow-lg"
            >
              <Flag className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-bold text-blue-700">Nigeria's #1 Student Platform</span>
              <span className="accent-dot"></span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-gray-900">Revolutionizing</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                Student Experience
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl"
            >
              Your all-in-one platform for academics, entertainment, gaming, jobs, and campus shopping.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-base border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <Briefcase className="w-5 h-5" />
                Browse Jobs
              </Link>
            </motion.div>

            {/* Stats - MORE VIBRANT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 flex-wrap"
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-3 rounded-xl border-2 border-blue-200 shadow-md hover:scale-105 transition-transform">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">5K+</div>
                <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Students
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-3 rounded-xl border-2 border-purple-200 shadow-md hover:scale-105 transition-transform">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  Universities
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 px-4 py-3 rounded-xl border-2 border-pink-200 shadow-md hover:scale-105 transition-transform">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">200+</div>
                <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Events
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - MORE INTERACTIVE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative name rounded-3xl shadow-2xl p-40 border-4 border-white hover:scale-105 transition-transform duration-500">
                {/* Platform preview placeholder */}
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl animate-float flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Live Now!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl animate-float flex items-center gap-1" style={{ animationDelay: '0.5s' }}>
                <Zap className="w-4 h-4" />
                Trending
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
