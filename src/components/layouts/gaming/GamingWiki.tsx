import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Book, Search, Tag, Eye, Clock, ArrowRight, Gamepad2, Lightbulb, Users, Trophy, History, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const categoryIcons: any = {
  game: Gamepad2,
  strategy: Lightbulb,
  character: Users,
  tournament: Trophy,
  team: Users,
  guide: BookOpen,
  history: History,
};

export default function GamingWiki() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Topics" },
    { value: "game", label: "Games" },
    { value: "strategy", label: "Strategies" },
    { value: "guide", label: "Guides" },
    { value: "tournament", label: "Tournaments" },
    { value: "history", label: "History" },
  ];

  useEffect(() => {
    fetchEntries();
  }, [selectedCategory]);

  const fetchEntries = async () => {
    try {
      const response = await api.getGamingWiki({ category: selectedCategory !== "all" ? selectedCategory : undefined });
      setEntries(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch wiki entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry =>
    !searchTerm || 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredEntry = filteredEntries.find(e => e.is_featured) || filteredEntries[0];
  const regularEntries = filteredEntries.filter(e => e.id !== featuredEntry?.id);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <Book className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Gaming Encyclopedia</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gaming Wiki
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your comprehensive guide to games, strategies, and esports knowledge
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search wiki articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No wiki entries found</p>
          </div>
        ) : (
          <>
            {/* Featured Entry */}
            {featuredEntry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <Link
                  to={`/gaming/wiki/${featuredEntry.slug}`}
                  className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 md:p-12 text-white hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute inset-0 opacity-20">
                    {featuredEntry.image && (
                      <img src={featuredEntry.image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Featured Article</span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">
                      {featuredEntry.title}
                    </h3>
                    
                    {featuredEntry.summary && (
                      <p className="text-lg text-white/90 mb-6 line-clamp-2">
                        {featuredEntry.summary}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {featuredEntry.category && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {featuredEntry.category}
                        </span>
                      )}
                      {featuredEntry.views > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {featuredEntry.views} views
                        </span>
                      )}
                      <span className="flex items-center gap-2 ml-auto">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Regular Entries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEntries.map((entry, index) => {
                const CategoryIcon = categoryIcons[entry.category] || Book;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/gaming/wiki/${entry.slug}`}
                      className="group block h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                    >
                      {entry.image && (
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={entry.image}
                            alt={entry.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CategoryIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-xs font-semibold text-blue-600 uppercase">
                            {entry.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {entry.title}
                        </h3>

                        {entry.summary && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {entry.summary}
                          </p>
                        )}

                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {entry.tags.slice(0, 3).map((tag: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {entry.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {entry.views}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all">
                            Read
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
