import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNews } from "../../../../hooks/useEntertainment";
import { useAuth } from "../../../../context/AuthContext";
import NewsCard from "./NewsCard";

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
    "All",
    "Campus",
    "Academic",
    "Sports",
    "Technology",
    "Career",
    "International",
    "Research",
  ];
  const { news = [], loading, error, toggleLike, toggleBookmark } = useNews();
  const { isAuthenticated } = useAuth();

  const filteredNews = Array.isArray(news) 
    ? (activeCategory === "All"
        ? news
        : news.filter((newsItem) => (newsItem as any).category === activeCategory))
    : [];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <section className="max-w-[1120px] w-full mx-auto flex flex-col gap-[50px] py-12 md:py-[100px] px-6 lg:px-0">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold">
            Curated University News
          </h2>
          <p className="text-secondary text-lg mt-2">
            Stay updated with the latest happening around campus, curated by our
            editorial team
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex flex-wrap items-end gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  activeCategory === category
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500 text-center col-span-3">Loading news...</p>
        ) : error ? (
          <p className="text-red-500 text-center col-span-3">{error}</p>
        ) : filteredNews.length > 0 ? (
          filteredNews.slice(0, 3).map((newsItem) => (
            <NewsCard 
              key={newsItem.id} 
              news={newsItem} 
              onLike={() => newsItem.id && toggleLike(newsItem.id)}
              onBookmark={() => newsItem.id && toggleBookmark(newsItem.id)}
              isAuthenticated={isAuthenticated}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">No news available</p>
        )}
      </div>

      <div className=" p-4 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Trending Now</h3>

        <div className="flex space-x-6 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
          {filteredNews.map((newsItem) => (
            <div key={newsItem.id} className="min-w-[300px] max-w-[300px]">
              <NewsCard 
                news={newsItem} 
                onLike={() => newsItem.id && toggleLike(newsItem.id)}
                onBookmark={() => newsItem.id && toggleBookmark(newsItem.id)}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          to={"/entertainment/news"}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
        >
          See all university news <ChevronRight size={18} className="ml-1" />
        </Link>
      </div>
    </section>
  );
}
