import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import ImageUpload from '../common/ImageUpload';
import supabaseDb from '../../services/supabase-db';

interface Slide {
  id?: string;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  is_active: boolean;
}

export default function SlideshowManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Slide>({
    title: '',
    description: '',
    image: '',
    link: '',
    order: 0,
    is_active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('slideshow')
        .select('*')
        .order('order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that we have an image
    if (!imagePreview && !formData.image) {
      alert('Please upload an image for the slide');
      return;
    }
    
    setSaving(true);
    try {
      let imageUrl = formData.image;
      
      // Upload new image if selected
      if (imageFile) {
        const fileName = `slideshow/${Date.now()}-${imageFile.name}`;
        imageUrl = await supabaseDb.uploadFile('images', fileName, imageFile);
      }

      const slideData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        link: formData.link,
        order: formData.order,
        is_active: formData.is_active
      };

      if (editingId) {
        const { error } = await supabase
          .from('slideshow')
          .update(slideData)
          .eq('id', editingId);

        if (error) throw error;
        alert('Slide updated successfully!');
      } else {
        const { error } = await supabase
          .from('slideshow')
          .insert([slideData]);

        if (error) throw error;
        alert('Slide created successfully!');
      }

      resetForm();
      fetchSlides();
    } catch (error: any) {
      console.error('Error saving slide:', error);
      alert('Failed to save slide: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (slide: any) => {
    setEditingId(slide.id);
    setFormData({
      title: slide.title,
      description: slide.description,
      image: slide.image,
      link: slide.link || '',
      order: slide.order,
      is_active: slide.is_active
    });
    setImagePreview(slide.image || '');
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('slideshow')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Slide deleted successfully!');
      fetchSlides();
    } catch (error: any) {
      console.error('Error deleting slide:', error);
      alert('Failed to delete slide: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      order: 0,
      is_active: true
    });
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) {
    return <div className="text-center py-8">Loading slides...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Homepage Slideshow Manager</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">
          {editingId ? 'Edit Slide' : 'Add New Slide'}
        </h3>

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <ImageUpload
            image={imageFile}
            imagePreview={imagePreview}
            isDragging={isDragging}
            onImageChange={handleImageChange}
            onRemove={() => {
              setImageFile(null);
              setImagePreview('');
            }}
            onDragStateChange={setIsDragging}
            label="Slide Image *"
            enableCrop={true}
            aspectRatio={16/9}
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080px (16:9 ratio)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Link (Optional)</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {slides.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No slides yet. Create your first slide above!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Preview</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {slides.map((slide: any) => (
                <tr key={slide.id}>
                  <td className="px-4 py-3">
                    {slide.image && (
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-20 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">{slide.order}</td>
                  <td className="px-4 py-3">{slide.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      slide.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
