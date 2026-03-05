import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Trophy, User, Medal } from 'lucide-react';
import api from '../../services/api';

interface LeaderboardEntry {
  player: string;
  score: number;
  rank?: number;
}

interface Leaderboard {
  _id?: string;
  name: string;
  game: string;
  entries: LeaderboardEntry[];
}

export default function LeaderboardManager() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', game: '' });
  const [entries, setEntries] = useState<LeaderboardEntry[]>([{ player: '', score: 0 }]);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const response = await api.getLeaderboards();
      const data = response.data.data || response.data || [];
      setLeaderboards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch leaderboards:', error);
      setLeaderboards([]);
    }
  };

  const addEntry = () => {
    setEntries([...entries, { player: '', score: 0 }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: 'player' | 'score', value: string | number) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: field === 'score' ? Number(value) : value };
    setEntries(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sortedEntries = entries
        .filter(e => e.player.trim() && e.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      if (sortedEntries.length === 0) {
        alert('Please add at least one valid player entry');
        setLoading(false);
        return;
      }

      const data = { ...formData, entries: sortedEntries };

      if (editingId) {
        await api.api.put(`/gaming/leaderboards/${editingId}`, data);
      } else {
        await api.api.post('/gaming/leaderboards', data);
      }

      resetForm();
      fetchLeaderboards();
    } catch (error: any) {
      console.error('Failed to save leaderboard:', error);
      alert(error.response?.data?.message || 'Failed to save leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leaderboard: Leaderboard) => {
    setEditingId(leaderboard._id!);
    setFormData({ name: leaderboard.name, game: leaderboard.game });
    setEntries(leaderboard.entries.length > 0 
      ? leaderboard.entries.map(e => ({ player: e.player, score: e.score }))
      : [{ player: '', score: 0 }]
    );
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this leaderboard? This action cannot be undone.')) return;
    
    try {
      await api.api.delete(`/gaming/leaderboards/${id}`);
      fetchLeaderboards();
    } catch (error) {
      console.error('Failed to delete leaderboard:', error);
      alert('Failed to delete leaderboard');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', game: '' });
    setEntries([{ player: '', score: 0 }]);
    setEditingId(null);
    setShowForm(false);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50';
    if (rank === 2) return 'text-gray-600 bg-gray-50';
    if (rank === 3) return 'text-orange-600 bg-orange-50';
    return 'text-gray-700 bg-gray-50';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Medal size={16} className={rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : 'text-orange-500'} />;
    return <span className="text-xs font-semibold">#{rank}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leaderboards</h2>
          <p className="text-sm text-gray-500 mt-1">Manage game leaderboards and rankings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Leaderboard'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg space-y-4 border border-amber-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leaderboard Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Weekly Champions"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Game *</label>
              <input
                type="text"
                required
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Chess, FIFA, Valorant"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Players & Scores *</label>
              <button
                type="button"
                onClick={addEntry}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                Add Player
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {entries.map((entry, index) => (
                <div key={index} className="flex gap-2 items-center bg-white p-2 rounded-lg">
                  <span className="text-gray-500 font-semibold w-8 text-center">{index + 1}</span>
                  <input
                    type="text"
                    required
                    value={entry.player}
                    onChange={(e) => updateEntry(index, 'player', e.target.value)}
                    placeholder="Player name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    required
                    min="0"
                    value={entry.score}
                    onChange={(e) => updateEntry(index, 'score', e.target.value)}
                    placeholder="Score"
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Rankings will be automatically sorted by score (highest first)</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : editingId ? 'Update Leaderboard' : 'Create Leaderboard'}
            </button>
            <button 
              type="button" 
              onClick={resetForm} 
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {leaderboards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No leaderboards yet. Create your first one!</p>
          </div>
        ) : (
          leaderboards.map((leaderboard) => (
            <div key={leaderboard._id} className="p-5 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Trophy size={22} className="text-amber-600" />
                    {leaderboard.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Game: <span className="font-medium">{leaderboard.game}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{leaderboard.entries?.length || 0} players</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(leaderboard)} 
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit leaderboard"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(leaderboard._id!)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete leaderboard"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {leaderboard.entries && leaderboard.entries.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.entries.slice(0, 10).map((entry, idx) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center text-sm py-2 px-3 rounded-lg ${getRankColor(entry.rank || idx + 1)}`}
                    >
                      <span className="flex items-center gap-3 flex-1">
                        <span className="w-8 flex items-center justify-center">
                          {getRankIcon(entry.rank || idx + 1)}
                        </span>
                        <User size={14} className="text-gray-400" />
                        <span className="font-medium">{entry.player}</span>
                      </span>
                      <span className="font-bold text-amber-600 text-lg">{entry.score.toLocaleString()}</span>
                    </div>
                  ))}
                  {leaderboard.entries.length > 10 && (
                    <p className="text-xs text-gray-500 text-center pt-2">+ {leaderboard.entries.length - 10} more players</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No entries yet</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
