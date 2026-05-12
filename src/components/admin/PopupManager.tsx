import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Bell } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

const emptyForm = { title: '', content: '', cta_text: '', cta_link: '', trigger: 'onload', delay_seconds: 3, is_active: true };

export default function PopupManager() {
  const [popups, setPopups] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPopups(); }, []);

  const fetchPopups = async () => {
    try {
      const r = await api.getAllPopups();
      setPopups(r.data?.data || []);
    } catch { setPopups([]); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v.toString()));
      if (image) data.append('image', image);
      if (editingId) await api.updatePopup(editingId, data);
      else await api.createPopup(data);
      alert('Popup saved successfully!');
      reset(); fetchPopups();
    } catch (err) { 
      console.error(err); 
      alert('Failed to save popup. Please try again.');
    }
    finally { setLoading(false); }
  };

  const handleEdit = (popup: any) => {
    setEditingId(popup.id);
    setForm({ title: popup.title || '', content: popup.content || '', cta_text: popup.cta_text || '', cta_link: popup.cta_link || '', trigger: popup.trigger || 'onload', delay_seconds: popup.delay_seconds || 3, is_active: popup.is_active !== false });
    setImagePreview(popup.image || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this popup?')) return;
    try { await api.deletePopup(id); fetchPopups(); } catch {}
  };

  const reset = () => { setForm(emptyForm); setImage(null); setImagePreview(''); setEditingId(null); setShowForm(false); };
  const f = (k: keyof typeof form, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Bell size={24} />Popup Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Manage site-wide popups and announcements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          <Plus size={20} />{showForm ? 'Cancel' : 'Add Popup'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload image={image} imagePreview={imagePreview} isDragging={isDragging}
            onImageChange={f => { setImage(f); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result as string); r.readAsDataURL(f); }}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging} label="Popup Image (optional)" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required value={form.title} onChange={e => f('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea rows={3} value={form.content} onChange={e => f('content', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
              <input value={form.cta_text} onChange={e => f('cta_text', e.target.value)} placeholder="e.g. Learn More" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
              <input value={form.cta_link} onChange={e => f('cta_link', e.target.value)} placeholder="e.g. /jobs" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
              <select value={form.trigger} onChange={e => f('trigger', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                <option value="onload">On Page Load</option>
                <option value="timed">Timed Delay</option>
                <option value="exit">Exit Intent</option>
                <option value="scroll">On Scroll</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delay (seconds)</label>
              <input type="number" min={0} value={form.delay_seconds} onChange={e => f('delay_seconds', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="rounded" />
            <span className="text-sm text-gray-700">Active (show on site)</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={reset} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {popups.length === 0 ? (
          <div className="text-center py-12 text-gray-500"><p>No popups yet.</p></div>
        ) : popups.map(popup => (
          <div key={popup.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {popup.image && <img src={popup.image} alt={popup.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{popup.title}</h3>
              <p className="text-sm text-gray-500 truncate">{popup.content}</p>
              <span className="text-xs text-orange-600">Trigger: {popup.trigger} {popup.delay_seconds > 0 && `(${popup.delay_seconds}s)`}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full ${popup.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {popup.is_active ? 'Active' : 'Hidden'}
              </span>
              <button onClick={() => handleEdit(popup)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(popup.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
