import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Building2, Calendar, Trophy, TrendingUp, Zap } from "lucide-react";
import api from "../../../services/api";

export default function LiveStatsSection() {
  const [stats, setStats] = useState({
    students: 0,
    universities: 0,
    events: 0,
    tournaments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.getHomepageStats();
      const data = response.data?.data?.[0] || {};
      setStats({
        students: data.students || 5000,
        universities: data.universities || 50,
        events: data.events || 200,
        tournaments: data.tournaments || 75,
      });
    } catch {
      setStats({
        students: 5000,
        universities: 50,
        events: 200,
        tournaments: 75,
      });
    }
  };

  const statsData = [
    { icon: Users, label: "Active Students", value: stats.students, color: "from-blue-500 to-cyan-500", suffix: "+" },
    { icon: Building2, label: "Universities", value: stats.universities, color: "from-purple-500 to-pink-500", suffix: "+" },
    { icon: Calendar, label: "Events Hosted", value: stats.events, color: "from-orange-500 to-red-500", suffix: "+" },
    { icon: Trophy, label: "Tournaments", value: stats.tournaments, color: "from-green-500 to-emerald-500", suffix: "+" },
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Growing Community</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Join Thousands of Students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be part of Nigeria's fastest-growing student platform
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <motion.div
                      className="text-3xl md:text-4xl font-bold text-gray-900"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    >
                      {stat.value.toLocaleString()}{stat.suffix}
                    </motion.div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
