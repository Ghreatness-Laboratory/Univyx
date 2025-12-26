import { useState } from 'react';
import { Plus, Edit, Trash2, Trophy, Users } from 'lucide-react';
import { useTournaments } from '../../hooks/useGaming';
import TournamentForm from './forms/TournamentForm';
import apiService from '../../services/api';

export default function TournamentManager() {
  const { tournaments, loading, error, refetch } = useTournaments();
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (tournament: any) => {
    setEditingTournament(tournament);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteTournament(id);
      setDeletingId(null);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleJoin = async (id: string) => {
    try {
      await apiService.joinTournament(id);
      refetch();
    } catch (error) {
      console.error('Join failed:', error);
    }
  };

  const handleLeave = async (id: string) => {
    try {
      await apiService.leaveTournament(id);
      refetch();
    } catch (error) {
      console.error('Leave failed:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTournament(null);
    refetch();
  };

  if (loading) return <div className="text-center py-8">Loading tournaments...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Tournament Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            New Tournament
          </button>
        </div>
      </div>

      <div className="p-6">
        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No tournaments found</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-yellow-600 hover:text-yellow-700"
            >
              Create your first tournament
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Trophy className="text-yellow-500" size={24} />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(tournament)}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingId(tournament.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{tournament.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{tournament.game}</p>
                
                <div className="text-sm text-gray-500 mb-3">
                  <p>Start: {tournament.start_date}</p>
                  <p>End: {tournament.end_date}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={14} className="mr-1" />
                    <span>{tournament.participants || 0} participants</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleJoin(tournament.id)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Join
                    </button>
                    <button
                      onClick={() => handleLeave(tournament.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TournamentForm
          tournament={editingTournament}
          onClose={handleFormClose}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Tournament</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this tournament?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}