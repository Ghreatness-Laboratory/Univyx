import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Trophy, Calendar, Users } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

interface Tournament {
  _id?: string;
  name: string;
  game: string;
  start_date: string;
  end_date: string;
  prize_pool: number;
  max_participants: number;
  status: string;
  image?: string;
}

export default function TournamentManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    start_date: '',
    end_date: '',
    prize_pool: 0,
    max_participants: 0,
    status: 'upcoming'
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await api.getTournaments();
      setTournaments(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
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
      data.append('name', formData.name);
      data.append('game', formData.game);
      data.append('start_date', formData.start_date);
      data.append('end_date', formData.end_date);
      data.append('prize_pool', formData.prize_pool.toString());
      data.append('max_participants', formData.max_participants.toString());
      data.append('status', formData.status);
      if (image) data.append('image', image);

      if (editingId) {
        await api.api.put(`/gaming/tournaments/${editingId}`, data);
      } else {
        await api.api.post('/gaming/tournaments', data);
      }

      resetForm();
      fetchTournaments();
    } catch (error) {
      console.error('Failed to save tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingId(tournament._id!);
    setFormData({
      name: tournament.name,
      game: tournament.game,
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      prize_pool: tournament.prize_pool,
      max_participants: tournament.max_participants,
      status: tournament.status
    });
    setImagePreview(tournament.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tournament?')) return;
    try {
      await api.api.delete(`/gaming/tournaments/${id}`);
      fetchTournaments();
    } catch (error) {
      console.error('Failed to delete tournament:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      game: '',
      start_date: '',
      end_date: '',
      prize_pool: 0,
      max_participants: 0,
      status: 'upcoming'
    });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tournaments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Tournament'}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tournament Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Game</label>
              <input
                type="text"
                required
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="datetime-local"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prize Pool ($)</label>
              <input
                type="number"
                required
                value={formData.prize_pool}
                onChange={(e) => setFormData({ ...formData, prize_pool: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
              <input
                type="number"
                required
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
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
        {tournaments.map((tournament) => (
          <div key={tournament._id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {tournament.image && (
              <img src={tournament.image} alt={tournament.name} className="w-24 h-24 object-cover rounded-lg" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-600" />
                {tournament.name}
              </h3>
              <p className="text-sm text-gray-600">Game: {tournament.game}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(tournament.start_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  Max: {tournament.max_participants}
                </span>
                <span className="font-semibold text-yellow-600">${tournament.prize_pool}</span>
              </div>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                tournament.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {tournament.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(tournament)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(tournament._id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
