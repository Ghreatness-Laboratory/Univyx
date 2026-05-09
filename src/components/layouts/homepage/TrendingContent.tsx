import { motion } from "framer-motion";
import { Flame, Eye, MessageCircle, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const trending = [
  { 
    title: "FIFA 24 Tournament Finals - ₦50k Prize", 
    category: "Gaming", 
    views: "2.3k", 
    comments: 45, 
    time: "2h ago",
    hot: true,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop"
  },
  { 
    title: "Study Group: Data Structures & Algorithms", 
    category: "Academics", 
    views: "1.8k", 
    comments: 32, 
    time: "4h ago",
    hot: true,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"
  },
  { 
    title: "Campus Fest 2024 - Lineup Announced!", 
    category: "Entertainment", 
    views: "3.1k", 
    comments: 67, 
    time: "5h ago",
    hot: true,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop"
  },
  { 
    title: "Tech Internship Opportunities at Microsoft", 
    category: "Jobs", 
    views: "4.2k", 
    comments: 89, 
    time: "6h ago",
    hot: true,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop"
  },
];

export default function TrendingContent() {
  return (
    <section className="py-8 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trending.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  HOT
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-blue-600 uppercase">{item.category}</span>
                <h3 className="font-bold text-gray-900 mt-1 mb-2 line-clamp-2 text-sm">{item.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {item.comments}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/entertainment" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            View All Trending
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
