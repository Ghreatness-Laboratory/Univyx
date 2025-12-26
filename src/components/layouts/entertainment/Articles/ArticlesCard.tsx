import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Clock,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Article } from "../../../../types/api";

interface ArticleCardProps {
  article: Article;
  className?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  isAuthenticated?: boolean;
}

export default function ArticleCard({ 
  article, 
  className, 
  onLike, 
  onBookmark, 
  isAuthenticated = false 
}: ArticleCardProps) {
  const [, setSearchParams] = useSearchParams();
  
  const openModal = () => {
    setSearchParams({ id: article.id?.toString() || '', section: "articles" });
  };
  
  const handleLike = () => {
    if (isAuthenticated && onLike) {
      onLike();
    }
  };
  
  const handleBookmark = () => {
    if (isAuthenticated && onBookmark) {
      onBookmark();
    }
  };
  
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="h-60 overflow-hidden relative">
        <img
          src={article.image || '/placeholder-image.jpg'}
          alt={article.title || 'Article image'}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <User size={14} className="text-gray-500 mr-1" />
              <span className="text-xs text-gray-700 font-medium">
                {article.author || 'Anonymous'}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <Clock size={14} className="text-gray-500 mr-1" />
              <span className="text-xs text-gray-500">
                {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
          {article.title || 'Untitled Article'}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.content || 'No content available'}
        </p>
        <div className="flex justify-between items-center">
          <Link
            to={`/entertainment/articles/${article.id}`}
            className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            Read full article <ChevronRight size={16} />
          </Link>
          <div className="flex items-center gap-3">
            <button
              className={`flex items-center gap-1 ${
                article.liked ? "text-red-500" : "text-gray-400"
              } hover:text-red-500 transition-colors disabled:opacity-50`}
              onClick={handleLike}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Login to like articles" : ""}
            >
              <Heart size={16} fill={article.liked ? "currentColor" : "none"} />
              <span className="text-xs">
                {article.likes_count || 0}
              </span>
            </button>
            <button
              className={`${
                article.bookmarked ? "text-purple-500" : "text-gray-400"
              } hover:text-purple-500 transition-colors disabled:opacity-50`}
              onClick={handleBookmark}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Login to bookmark articles" : ""}
            >
              {article.bookmarked ? (
                <BookmarkCheck size={16} />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
              <MessageCircle size={16} />
              <span className="text-xs">{article.comments_count || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}