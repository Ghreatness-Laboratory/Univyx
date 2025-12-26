import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, MessageCircle, Share2 } from 'lucide-react';
import { useArticle } from '../hooks/useEntertainment';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/common/CommentSection';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, loading, error } = useArticle(id!);
  const { comments, addComment } = useComments('articles', id!);
  const { isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/entertainment')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Entertainment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/entertainment')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Articles
        </button>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>By {article.author}</span>
                <span className="mx-2">•</span>
                <span>{article.created_at}</span>
              </div>

              <div className="flex items-center space-x-6 py-4 border-y border-gray-200">
                <button
                  className={`flex items-center space-x-2 ${
                    article.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                  disabled={!isAuthenticated}
                >
                  <Heart size={20} fill={article.liked ? 'currentColor' : 'none'} />
                  <span>{article.likes_count}</span>
                </button>
                
                <button
                  className={`flex items-center space-x-2 ${
                    article.bookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                  }`}
                  disabled={!isAuthenticated}
                >
                  <Bookmark size={20} fill={article.bookmarked ? 'currentColor' : 'none'} />
                  <span>Save</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                  <MessageCircle size={20} />
                  <span>{article.comments_count}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8">
          <CommentSection
            comments={comments}
            onAddComment={addComment}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
}