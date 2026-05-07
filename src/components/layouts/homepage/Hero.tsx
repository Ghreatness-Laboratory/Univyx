import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, BookOpen, Trophy, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import HeroImage from "../../../assets/images/homepage/hero-image.png";
import api from "../../../services/api";

export default function Hero() {
  const [stats, setStats] = useState([
    { icon: Users, value: "0", label: "Active Students" },
    { icon: BookOpen, value: "0", label: "Universities" },
    { icon: Trophy, value: "0", label: "Tournaments" },
  ]);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetchStats();
    fetchSlides();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const fetchStats = async () => {
    try {
      const response = await api.getHomepageStats();
      const data = response.data.data;
      setStats([
        { icon: Users, value: `${(data.students / 1000).toFixed(0)}K+`, label: "Active Students" },
        { icon: BookOpen, value: `${data.universities}+`, label: "Universities" },
        { icon: Trophy, value: `${data.tournaments}+`, label: "Tournaments" },
      ]);
    } catch {}
  };

  const fetchSlides = async () => {
    try {
      const response = await api.getSlideshow();
      const data = response.data?.data || [];
      setSlides(data);
    } catch {}
  };

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrentSlide(index);
  }, []);

  const prev = () => goTo((currentSlide - 1 + slides.length) % slides.length, -1);
  const next = () => goTo((currentSlide + 1) % slides.length, 1);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }),
  };

  const hasSlides = slides.length > 0;

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000" />
      </div>

      {/* Slideshow (if slides exist) */}
      {hasSlides && (
        <div className="relative z-10 w-full overflow-hidden" style={{ minHeight: 320 }}>
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              {slides[currentSlide]?.image && (
                <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-80 object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end pb-10 px-6 text-center">
                <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-white text-3xl md:text-5xl font-extrabold mb-3">
                  {slides[currentSlide]?.title}
                </motion.h2>
                {slides[currentSlide]?.subtitle && (
                  <p className="text-white/80 text-lg mb-4">{slides[currentSlide].subtitle}</p>
                )}
                {slides[currentSlide]?.cta_text && slides[currentSlide]?.cta_link && (
                  <Link to={slides[currentSlide].cta_link} className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all">
                    {slides[currentSlide].cta_text}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide controls */}
          {slides.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                <ChevronRight size={20} className="text-white" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => goTo(i, i > currentSlide ? 1 : -1)} className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? "bg-white w-6" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Hero Content */}
      <section className="relative z-20 w-full mx-auto flex flex-col px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-4 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Trusted by {stats[1].value} Universities</span>
          </motion.div>

          <motion.h1
            className="max-w-5xl mx-auto text-primary font-bold text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Revolutionizing
            </span>
            <br />
            <span className="relative">
              Student Experience
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect, learn, and thrive. Entertainment, gaming, jobs, and a campus store, all in one place for private university students.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
            >
              Browse Jobs
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div key={index} className="text-center group cursor-pointer" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
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
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-2 shadow-2xl">
              <img src={HeroImage} alt="Univyx Platform Preview" className="w-full h-auto rounded-xl md:rounded-2xl shadow-lg" />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
