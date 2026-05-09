import { motion } from "framer-motion";
import { Bell, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const activities = [
  { icon: Users, text: "John just joined from UNILAG!", color: "text-blue-600" },
  { icon: TrendingUp, text: "50+ new jobs posted today", color: "text-green-600" },
  { icon: Zap, text: "Gaming tournament starting soon!", color: "text-purple-600" },
  { icon: Bell, text: "New article: Campus Life Tips", color: "text-orange-600" },
  { icon: Users, text: "Sarah bookmarked an event", color: "text-pink-600" },
  { icon: TrendingUp, text: "100+ students online now", color: "text-indigo-600" },
];

export default function ActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = activities[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center justify-center gap-3 text-white"
        >
          <Icon className="w-5 h-5 animate-pulse" />
          <span className="font-medium text-sm md:text-base">{current.text}</span>
          <span className="accent-dot bg-white"></span>
        </motion.div>
      </div>
    </div>
  );
}
