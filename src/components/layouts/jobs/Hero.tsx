import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const badges = [
  { icon: Shield, label: "Verified Pay Records", color: "text-green-400 bg-green-900/30 border-green-700/40" },
  { icon: GraduationCap, label: "SIWES Placements", color: "text-blue-400 bg-blue-900/30 border-blue-700/40" },
  { icon: MapPin, label: "NYSC Postings", color: "text-purple-400 bg-purple-900/30 border-purple-700/40" },
  { icon: TrendingUp, label: "Internships", color: "text-orange-400 bg-orange-900/30 border-orange-700/40" },
];

const stats = [
  { icon: Briefcase, value: "500+", label: "Active Jobs" },
  { icon: Users, value: "2K+", label: "Students Placed" },
  { icon: Shield, value: "100%", label: "Pay Verified" },
];

export default function JobsHero() {
  return (
    <header className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 md:py-28">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 opacity-10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 opacity-5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/40 border border-blue-700/40 mb-6"
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-300">Powered by CivilProviding</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              Your Career{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Starts Here
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-slate-300 mb-8 leading-relaxed"
            >
              Verified jobs, SIWES placements, NYSC postings and internships — only from employers with{" "}
              <span className="text-blue-300 font-semibold">proven pay records</span>. Students can also list their skills and get hired.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
            >
              {badges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <span key={i} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${badge.color}`}>
                    <Icon size={12} />
                    {badge.label}
                  </span>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a href="#jobs-grid" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-blue-500/30">
                Browse Opportunities
              </a>
              <Link to="/signup" className="px-8 py-3 border border-blue-500/50 bg-blue-900/20 text-blue-300 font-semibold rounded-full hover:bg-blue-800/30 transition-all">
                List Your Skills
              </Link>
            </motion.div>
          </div>

          {/* Right — Stats card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-80 flex-shrink-0"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Platform Stats</h3>
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 bg-blue-600/30 rounded-lg flex items-center justify-center">
                      <Icon size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-xl">{stat.value}</p>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center">All employers verified with pay history ✓</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
