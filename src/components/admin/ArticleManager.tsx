import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';
import { Article } from '../../types/api';

export default function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Other' });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.getArticles();
      const data = response.data.data || response.data || [];
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setArticles([]);
    }
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      if (image) data.append('image', image);

      if (editingId) {
        await api.updateArticle(editingId, data as any);
      } else {
        await api.createArticle(data as any);
      }

      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id!);
    setFormData({ title: article.title || '', content: article.content || '', category: 'Other' });
    setImagePreview(article.image || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.deleteArticle(id);
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'Other' });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Article'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload
            image={image}
            imagePreview={imagePreview}
            isDragging={isDragging}
            onImageChange={handleImageChange}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {article.image && <img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded-lg" />}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{article.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{article.content}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(article)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(article.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
