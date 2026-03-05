import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

export default function GalleryManager() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.getGallery();
      const data = response.data.data || response.data || [];
      setGallery(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setGallery([]);
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
      data.append('description', formData.description);
      if (image) data.append('image', image);

      await api.createGalleryItem(data);
      resetForm();
      fetchGallery();
    } catch (error) {
      console.error('Failed to save gallery item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      await api.deleteGalleryItem(id);
      fetchGallery();
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setImage(null);
    setImagePreview('');
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gaming Gallery</h2>
          <p className="text-sm text-gray-500 mt-1">Manage gaming gallery images</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg space-y-4 border border-pink-200">
          <ImageUpload
            image={image}
            imagePreview={imagePreview}
            isDragging={isDragging}
            onImageChange={handleImageChange}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Add to Gallery'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item._id} className="relative group rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            {item.image && <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />}
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
              {item.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>}
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
