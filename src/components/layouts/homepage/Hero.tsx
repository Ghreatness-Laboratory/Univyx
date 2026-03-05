import { motion } from "framer-motion";
import { ArrowRight, Users, BookOpen, Trophy, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import HeroImage from "../../../assets/images/homepage/hero-image.png";
import GraduationHatVideo from "../../../assets/graduationhat.mp4";
import api from "../../../services/api";

export default function Hero() {
  const [stats, setStats] = useState([
    { icon: Users, value: "0", label: "Active Students" },
    { icon: BookOpen, value: "0", label: "Universities" },
    { icon: Trophy, value: "0", label: "Tournaments" },
  ]);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchPartners();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.getHomepageStats();
      const data = response.data.data;
      setStats([
        { icon: Users, value: `${(data.students / 1000).toFixed(0)}K+`, label: "Active Students" },
        { icon: BookOpen, value: `${data.universities}+`, label: "Universities" },
        { icon: Trophy, value: `${data.tournaments}+`, label: "Tournaments" },
      ]);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await api.getPartners();
      setPartners(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    }
  };

  const floatingElements = [
    { icon: Sparkles, delay: 0, x: 20, y: -30 },
    { icon: BookOpen, delay: 0.5, x: -25, y: 40 },
    { icon: Trophy, delay: 1, x: 30, y: 20 },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-10"
        >
          <source src={GraduationHatVideo} type="video/mp4" />
        </video>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Floating Icons */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.icon;
        return (
          <motion.div
            key={index}
            className="absolute hidden lg:block text-blue-400 opacity-20"
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 25}%`,
            }}
            animate={{
              y: [0, element.y, 0],
              x: [0, element.x, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <IconComponent size={32} />
          </motion.div>
        );
      })}

      <section className="relative z-20 w-full mx-auto flex flex-col px-6 lg:px-8 py-16 md:py-24 max-w-7xl">
        {/* Main Content */}
        <div className="text-center mb-16">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-8 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Trusted by {stats[1].value} Universities</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="max-w-5xl mx-auto text-primary font-bold text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-8"
            data-testid="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Revolutionizing
            </span>
            <br />
            <span className="relative">
              Student Life
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect, learn, and thrive in a vibrant community designed for private university students worldwide.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button 
              onClick={() => window.location.href = '/signup'}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-2 mx-auto group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Main Image */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-2 shadow-2xl">
              <img
                src={HeroImage}
                alt="Univyx Platform Preview"
                className="w-full h-auto rounded-xl md:rounded-2xl shadow-lg"
                aria-label="Platform preview showing student dashboard and features"
              />
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-sm text-gray-500 mb-6">Trusted by students from leading universities</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {partners.slice(0, 3).map((partner) => (
              <div key={partner._id} className="w-24 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-xs font-medium text-gray-500">{partner.name}</span>
                )}
              </div>
            ))}
            {partners.length === 0 && (
              <>
                <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">University</span>
                </div>
                <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">College</span>
                </div>
                <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">Institute</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
