import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNews } from '../../hooks/useEntertainment';
import { News } from '../../types/api';
import NewsForm from './forms/NewsForm';
import apiService from '../../services/api';

export default function NewsManager() {
  const { news, loading, error, refetch } = useNews();
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteNewsById(id);
      setDeletingId(null);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingNews(null);
    refetch();
  };

  if (loading) return <div className="text-center py-8">Loading news...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">News Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            New Article
          </button>
        </div>
      </div>

      <div className="p-6">
        {news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No news articles found</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              Create your first news article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((newsItem) => (
              <div key={newsItem.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{newsItem.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{newsItem.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {newsItem.author}</span>
                      <span>{newsItem.published_at}</span>
                      <span>{newsItem.likes_count} likes</span>
                      <span>{newsItem.comments_count} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingId(newsItem.id!)}
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
        <NewsForm
          news={editingNews}
          onClose={handleFormClose}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete News Article</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this news article?</p>
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