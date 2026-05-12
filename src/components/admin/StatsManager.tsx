import { useState, useEffect } from 'react';
import { BarChart3, Save } from 'lucide-react';
import { supabase } from '../../services/supabase-client';

export default function StatsManager() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ students: 0, universities: 0, events: 0, tournaments: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_stats')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setStats({
          students: data.students || 0,
          universities: data.universities || 0,
          events: data.events || 0,
          tournaments: data.tournaments || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ students: 0, universities: 0, events: 0, tournaments: 0 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if stats exist
      const { data: existing } = await supabase
        .from('homepage_stats')
        .select('id')
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('homepage_stats')
          .update(stats)
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('homepage_stats')
          .insert([stats]);
        
        if (error) throw error;
      }

      alert('Stats updated successfully!');
      await fetchStats();
    } catch (error: any) {
      console.error('Failed to update stats:', error);
      alert('Failed to update stats: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 size={24} className="text-green-600" />
          Homepage Statistics
        </h2>
        <p className="text-sm text-gray-500 mt-1">Update homepage stats counters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Students</label>
            <input
              type="number"
              value={stats.students || ''}
              onChange={(e) => setStats({ ...stats, students: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Universities</label>
            <input
              type="number"
              value={stats.universities || ''}
              onChange={(e) => setStats({ ...stats, universities: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
            <input
              type="number"
              value={stats.events || ''}
              onChange={(e) => setStats({ ...stats, events: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tournaments</label>
            <input
              type="number"
              value={stats.tournaments || ''}
              onChange={(e) => setStats({ ...stats, tournaments: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Update Statistics'}
        </button>
      </form>
    </div>
  );
}
