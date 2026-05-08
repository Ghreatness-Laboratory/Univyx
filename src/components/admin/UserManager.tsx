import { useState, useEffect } from 'react';
import { Users, Shield, Ban, CheckCircle, Mail, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'active') return !user.banned_until;
    if (filter === 'banned') return user.banned_until;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            All ({users.length})
          </button>
          <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            Active
          </button>
          <button onClick={() => setFilter('banned')} className={`px-4 py-2 rounded-lg ${filter === 'banned' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            Banned
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </h3>
                  {user.banned_until && <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Banned</span>}
                  {user.email_confirmed_at && <CheckCircle size={16} className="text-green-500" />}
                </div>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Mail size={14} />{user.email}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} />Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Users size={14} />ID: {user.id.slice(0, 8)}...</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                  <Shield size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
