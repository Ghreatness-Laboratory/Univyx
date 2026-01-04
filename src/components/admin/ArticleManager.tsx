import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useArticles } from '../../hooks/useEntertainment';
import { Article } from '../../types/api';
import ArticleForm from './forms/ArticleForm';
import apiService from '../../services/api';

export default function ArticleManager() {
  const { articles, loading, error, refetch } = useArticles();
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteArticleById(id);
      setDeletingId(null);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingArticle(null);
    refetch();
  };

  if (loading) return <div className="text-center py-8">Loading articles...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Article Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            New Article
          </button>
        </div>
      </div>

      <div className="p-6">
        {articles && articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No articles found</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-purple-600 hover:text-purple-700"
            >
              Create your first article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(articles) && articles.map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {article.author}</span>
                      <span>{article.created_at}</span>
                      <span>{article.likes_count} likes</span>
                      <span>{article.comments_count} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingId(article.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ArticleForm
          article={editingArticle}
          onClose={handleFormClose}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Article</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this article?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}