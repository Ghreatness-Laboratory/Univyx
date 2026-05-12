import { useState, useEffect } from 'react';
import { Briefcase, Users, GraduationCap, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface Slide {
  id: string;
  image: string;
  order: number;
  is_active: boolean;
}

export default function HeroSlideshow() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ students: 5000, universities: 50, events: 200 });
  const [onlineUsers, setOnlineUsers] = useState(127);

  useEffect(() => {
    fetchSlides();
    fetchStats();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('slideshow')
        .select('id, image, order, is_active')
        .eq('is_active', true)
        .order('order');
      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await supabase.from('homepage_stats').select('*').single();
      if (data) {
        setStats({
          students: data.students || 5000,
          universities: data.universities || 50,
          events: data.events || 200
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        {/* Top Bar */}
        <div className="flex justify-start items-center mb-8">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Briefcase size={20} />
            Browse Jobs
          </Link>
        </div>

        {/* Main Hero Section - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* LEFT SIDE - Content */}
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                  {stats.students >= 1000 ? `${Math.floor(stats.students / 1000)}K+` : `${stats.students}+`}
                </div>
                <div className="flex items-center gap-1.5 text-blue-700">
                  <Users size={16} />
                  <span className="text-sm font-medium">Students</span>
                </div>
              </div>
              <div className="bg-purple-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">{stats.universities}+</div>
                <div className="flex items-center gap-1.5 text-purple-700">
                  <GraduationCap size={16} />
                  <span className="text-sm font-medium">Universities</span>
                </div>
              </div>
              <div className="bg-pink-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-1">{stats.events}+</div>
                <div className="flex items-center gap-1.5 text-pink-700">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Events</span>
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <Sparkles size={18} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Nigeria's #1 Student Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connect, Compete,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Thrive</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Join thousands of students across Nigeria. Discover events, compete in tournaments, find opportunities, and build your future.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/entertainment"
                  className="inline-flex items-center gap-2 bg-white text-gray-800 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Explore Platform
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Image Slideshow */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 z-10 animate-bounce">
              <Sparkles size={18} />
              Live Now!
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Slideshow Images */}
              {slides.length > 0 ? (
                slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                ))
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
                  alt="Students"
                  className="w-full h-[500px] object-cover"
                />
              )}
              
              {/* Trending Badge */}
              <div className="absolute bottom-6 left-6">
                <div className="bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2">
                  <TrendingUp size={18} />
                  Trending
                </div>
              </div>

              {/* Slide Indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-6 right-6 flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-white w-8'
                          : 'bg-white/50 w-2 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
