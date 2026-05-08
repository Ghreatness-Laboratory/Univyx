import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUpload from '../common/ImageUpload';

export default function GamingWikiManager() {
  const [articles, setArticles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Guide',
    content: '',
    summary: '',
    is_published: true
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase.from('gaming_wiki').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Failed to fetch wiki articles:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
      let imageUrl = imagePreview;
      if (image) {
        const fileName = `gaming-wiki/${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(fileName, image, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
      const slug = formData.slug || generateSlug(formData.title);
      const data = { ...formData, slug, image: imageUrl };
      if (editingId) {
        const { error } = await supabase.from('gaming_wiki').update(data).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gaming_wiki').insert(data);
        if (error) throw error;
      }
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Failed to save wiki article:', error);
      alert('Failed to save wiki article');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      category: article.category,
      content: article.content,
      summary: article.summary,
      is_published: article.is_published
    });
    setImagePreview(article.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wiki article?')) return;
    try {
      const { error } = await supabase.from('gaming_wiki').delete().eq('id', id);
      if (error) throw error;
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete wiki article:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: 'Guide',
      content: '',
      summary: '',
      is_published: true
    });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gaming Wiki</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Article'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload image={image} imagePreview={imagePreview} isDragging={isDragging} onImageChange={handleImageChange} onRemove={() => { setImage(null); setImagePreview(''); }} onDragStateChange={setIsDragging} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" required value={formData.title} onChange={(e) => { setFormData({ ...formData, title: e.target.value }); if (!editingId) setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) })); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="Guide">Guide</option>
              <option value="Strategy">Strategy</option>
              <option value="Rules">Rules</option>
              <option value="Hardware">Hardware</option>
              <option value="Wellness">Wellness</option>
              <option value="Tips">Tips</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
            <input type="text" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded" />
            <label className="text-sm font-medium text-gray-700">Published</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {article.image && <img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded-lg" />}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{article.title}</h3>
                <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{article.category}</span>
                {!article.is_published && <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Draft</span>}
              </div>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{article.summary || article.content}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Eye size={14} />{article.views || 0} views</span>
                <span className="flex items-center gap-1"><BookOpen size={14} />{article.slug}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(article)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
