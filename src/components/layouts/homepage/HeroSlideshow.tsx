import { useState, useEffect } from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import heroImage from '../../../assets/images/homepage/hero-image.png';

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
    <div className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        {/* Top Navigation Bar */}
        <div className="flex justify-start items-center mb-12">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Briefcase size={20} />
            Browse Jobs
          </Link>
        </div>

        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE - Main Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                Nigeria's #1 Platform
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Revolutionizing
                <br />
                <span className="text-blue-600">Student</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Experience
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with thousands of students, discover opportunities, compete in tournaments, and build your future on Nigeria's fastest-growing student platform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Join Now →
                </Link>
                <Link
                  to="/entertainment"
                  className="bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-200"
                >
                  Explore Platform
                </Link>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {stats.students >= 1000 ? `${Math.floor(stats.students / 1000)}K+` : `${stats.students}+`}
                </div>
                <div className="text-sm text-gray-600 font-medium">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.universities}+</div>
                <div className="text-sm text-gray-600 font-medium">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.events}+</div>
                <div className="text-sm text-gray-600 font-medium">Events</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-4">
              {slides.length > 0 ? (
                slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-4'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-80 object-cover rounded-2xl"
                    />
                  </div>
                ))
              ) : (
                <img
                  src={heroImage}
                  alt="Students"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              )}
            </div>
            
            {/* Slide Indicators */}
            {slides.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-blue-600 w-8'
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
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
  );
}