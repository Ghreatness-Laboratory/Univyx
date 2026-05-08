import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Gamepad2 } from 'lucide-react';
import supabaseDb from '../../services/supabase-db';
import ImageUpload from '../common/ImageUpload';

export default function GamingEventManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    game: '',
    event_type: 'tournament',
    date: '',
    location: '',
    max_participants: 0,
    registration_url: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await supabaseDb.getGamingEvents();
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch gaming events:', error);
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
      let imageUrl = imagePreview;
      if (image) {
        const fileName = `gaming-events/${Date.now()}-${image.name}`;
        imageUrl = await supabaseDb.uploadFile('images', fileName, image);
      }
      const data = { ...formData, image: imageUrl };
      if (editingId) {
        await supabaseDb.updateGamingEvent(editingId, data);
      } else {
        await supabaseDb.createGamingEvent(data);
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Failed to save gaming event:', error);
      alert('Failed to save gaming event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      game: event.game,
      event_type: event.event_type,
      date: event.date,
      location: event.location,
      max_participants: event.max_participants,
      registration_url: event.registration_url || ''
    });
    setImagePreview(event.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gaming event?')) return;
    try {
      await supabaseDb.deleteGamingEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete gaming event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      game: '',
      event_type: 'tournament',
      date: '',
      location: '',
      max_participants: 0,
      registration_url: ''
    });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gaming Events</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Gaming Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload image={image} imagePreview={imagePreview} isDragging={isDragging} onImageChange={handleImageChange} onRemove={() => { setImage(null); setImagePreview(''); }} onDragStateChange={setIsDragging} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Game</label>
              <input type="text" required value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <select value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500">
                <option value="tournament">Tournament</option>
                <option value="competition">Competition</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
              <input type="number" value={formData.max_participants} onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration URL</label>
              <input type="url" value={formData.registration_url} onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {event.image && <img src={event.image} alt={event.title} className="w-24 h-24 object-cover rounded-lg" />}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">{event.event_type}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{event.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Gamepad2 size={14} />{event.game}</span>
                <span className="flex items-center gap-1"><Calendar size={14} />{new Date(event.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MapPin size={14} />{event.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(event)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
