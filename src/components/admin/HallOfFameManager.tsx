import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Trophy, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUpload from '../common/ImageUpload';

export default function HallOfFameManager() {
  const [players, setPlayers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gamertag: '',
    university: '',
    bio: '',
    favorite_game: '',
    rank: 100,
    total_mvps: 0,
    total_championships: 0,
    total_tournaments: 0,
    experience: '',
    is_featured: false,
    display_order: 0
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase.from('hall_of_fame_players').select('*').order('display_order');
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  const handleAvatarChange = (file: File) => {
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = avatarPreview;
      if (avatar) {
        const fileName = `hall-of-fame/${Date.now()}-${avatar.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(fileName, avatar, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        avatarUrl = publicUrl;
      }
      const data = { ...formData, avatar: avatarUrl };
      if (editingId) {
        const { error } = await supabase.from('hall_of_fame_players').update(data).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('hall_of_fame_players').insert(data);
        if (error) throw error;
      }
      resetForm();
      fetchPlayers();
    } catch (error) {
      console.error('Failed to save player:', error);
      alert('Failed to save player');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player: any) => {
    setEditingId(player.id);
    setFormData({
      name: player.name,
      gamertag: player.gamertag,
      university: player.university,
      bio: player.bio,
      favorite_game: player.favorite_game,
      rank: player.rank,
      total_mvps: player.total_mvps,
      total_championships: player.total_championships,
      total_tournaments: player.total_tournaments,
      experience: player.experience,
      is_featured: player.is_featured,
      display_order: player.display_order
    });
    setAvatarPreview(player.avatar || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this player?')) return;
    try {
      const { error } = await supabase.from('hall_of_fame_players').delete().eq('id', id);
      if (error) throw error;
      fetchPlayers();
    } catch (error) {
      console.error('Failed to delete player:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gamertag: '',
      university: '',
      bio: '',
      favorite_game: '',
      rank: 100,
      total_mvps: 0,
      total_championships: 0,
      total_tournaments: 0,
      experience: '',
      is_featured: false,
      display_order: 0
    });
    setAvatar(null);
    setAvatarPreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hall of Fame</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Player'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload image={avatar} imagePreview={avatarPreview} isDragging={isDragging} onImageChange={handleAvatarChange} onRemove={() => { setAvatar(null); setAvatarPreview(''); }} onDragStateChange={setIsDragging} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gamertag</label>
              <input type="text" value={formData.gamertag} onChange={(e) => setFormData({ ...formData, gamertag: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
              <input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Game</label>
              <input type="text" value={formData.favorite_game} onChange={(e) => setFormData({ ...formData, favorite_game: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rank (1-100)</label>
              <input type="number" min="1" max="100" required value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total MVPs</label>
              <input type="number" value={formData.total_mvps} onChange={(e) => setFormData({ ...formData, total_mvps: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Championships</label>
              <input type="number" value={formData.total_championships} onChange={(e) => setFormData({ ...formData, total_championships: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tournaments</label>
              <input type="number" value={formData.total_tournaments} onChange={(e) => setFormData({ ...formData, total_tournaments: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <input type="text" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="e.g. 5 years" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 text-amber-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Featured Player</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {player.avatar && <img src={player.avatar} alt={player.name} className="w-20 h-20 object-cover rounded-full" />}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{player.name}</h3>
                {player.is_featured && <Star size={16} className="text-amber-500 fill-amber-500" />}
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">{player.gamertag}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-1">{player.bio}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Trophy size={14} />Rank #{player.rank}</span>
                <span>{player.total_mvps} MVPs</span>
                <span>{player.total_championships} Championships</span>
                {player.experience && <span>{player.experience}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(player)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(player.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
