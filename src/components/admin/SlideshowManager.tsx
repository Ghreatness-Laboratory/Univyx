import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

const emptyForm = { title: '', subtitle: '', cta_text: '', cta_link: '', order: 0, is_active: true };

export default function SlideshowManager() {
  const [slides, setSlides] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSlides(); }, []);

  const fetchSlides = async () => {
    try {
      const r = await api.getSlideshow();
      setSlides(r.data?.data || []);
    } catch { setSlides([]); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v.toString()));
      if (image) data.append('image', image);
      if (editingId) await api.updateSlide(editingId, data);
      else await api.createSlide(data);
      reset(); fetchSlides();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEdit = (slide: any) => {
    setEditingId(slide.id);
    setForm({ title: slide.title || '', subtitle: slide.subtitle || '', cta_text: slide.cta_text || '', cta_link: slide.cta_link || '', order: slide.order || 0, is_active: slide.is_active !== false });
    setImagePreview(slide.image || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    try { await api.deleteSlide(id); fetchSlides(); } catch {}
  };

  const reset = () => { setForm(emptyForm); setImage(null); setImagePreview(''); setEditingId(null); setShowForm(false); };
  const f = (k: keyof typeof form, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Slideshow Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Manage homepage hero slideshow banners</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus size={20} />{showForm ? 'Cancel' : 'Add Slide'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload image={image} imagePreview={imagePreview} isDragging={isDragging}
            onImageChange={f => { setImage(f); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result as string); r.readAsDataURL(f); }}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging} label="Slide Background Image" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required value={form.title} onChange={e => f('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input value={form.subtitle} onChange={e => f('subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
              <input value={form.cta_text} onChange={e => f('cta_text', e.target.value)} placeholder="e.g. Learn More" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
              <input value={form.cta_link} onChange={e => f('cta_link', e.target.value)} placeholder="e.g. /jobs" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => f('order', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update Slide' : 'Create Slide'}
            </button>
            <button type="button" onClick={reset} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {slides.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No slides yet. Add your first slide to enable the homepage slideshow!</p>
          </div>
        ) : slides.map(slide => (
          <div key={slide.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <GripVertical size={18} className="text-gray-300 shrink-0" />
            {slide.image && <img src={slide.image} alt={slide.title} className="w-20 h-12 object-cover rounded-lg shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{slide.title}</h3>
              {slide.subtitle && <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>}
              {slide.cta_text && <span className="text-xs text-purple-600">CTA: {slide.cta_text} → {slide.cta_link}</span>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {slide.is_active ? 'Active' : 'Hidden'}
              </span>
              <button onClick={() => handleEdit(slide)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(slide.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
