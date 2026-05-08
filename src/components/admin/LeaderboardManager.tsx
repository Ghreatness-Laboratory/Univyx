import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Trophy, User, Medal } from 'lucide-react';
import supabaseDb from '../../services/supabase-db';

interface LeaderboardEntry {
  id?: string;
  player_name: string;
  score: number;
  wins?: number;
  rank?: number;
}

interface Leaderboard {
  id?: string;
  game: string;
  season?: string;
  player_name: string;
  score: number;
  wins: number;
  rank?: number;
  created_at?: string;
}

export default function LeaderboardManager() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ game: '', season: 'All Time', player_name: '', score: 0, wins: 0 });

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const response = await supabaseDb.getLeaderboards();
      setLeaderboards(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch leaderboards:', error);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await supabaseDb.updateLeaderboard(editingId, formData);
      } else {
        await supabaseDb.createLeaderboard(formData);
      }
      resetForm();
      fetchLeaderboards();
    } catch (error: any) {
      console.error('Failed to save leaderboard:', error);
      alert('Failed to save leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leaderboard: Leaderboard) => {
    setEditingId(leaderboard.id!);
    setFormData({ 
      game: leaderboard.game, 
      season: leaderboard.season || 'All Time',
      player_name: leaderboard.player_name,
      score: leaderboard.score,
      wins: leaderboard.wins
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this leaderboard entry?')) return;
    try {
      await supabaseDb.deleteLeaderboard(id);
      fetchLeaderboards();
    } catch (error) {
      console.error('Failed to delete leaderboard:', error);
    }
  };

  const resetForm = () => {
    setFormData({ game: '', season: 'All Time', player_name: '', score: 0, wins: 0 });
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
          <h2 className="text-2xl font-bold text-gray-900">Power Rankings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage game power rankings and player standings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Ranking'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg space-y-4 border border-amber-200">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Game *</label>
              <input
                type="text"
                required
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., FIFA, Valorant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Season 1, 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Player Name *</label>
              <input
                type="text"
                required
                value={formData.player_name}
                onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Player name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Score/Points *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wins</label>
              <input
                type="number"
                min="0"
                value={formData.wins}
                onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 font-medium">
              {loading ? 'Saving...' : editingId ? 'Update Entry' : 'Create Entry'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {leaderboards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No power rankings yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leaderboards.map((entry, idx) => (
              <div key={entry.id} className={`flex justify-between items-center p-4 rounded-lg border ${getRankColor(idx + 1)}`}>
                <div className="flex items-center gap-4 flex-1">
                  <span className="w-10 flex items-center justify-center">{getRankIcon(idx + 1)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="font-semibold text-lg">{entry.player_name}</span>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-600 mt-1">
                      <span>Game: {entry.game}</span>
                      {entry.season && <span>• {entry.season}</span>}
                      {entry.wins > 0 && <span>• {entry.wins} Wins</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-2xl text-amber-600">{entry.score.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(entry)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(entry.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
