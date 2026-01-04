import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UserStats {
  articles_read: number;
  events_attended: number;
  comments_posted: number;
  bookmarks_count: number;
  likes_count: number;
}

export const useUserStats = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    articles_read: 0,
    events_attended: 0,
    comments_posted: 0,
    bookmarks_count: 0,
    likes_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Try to get stats from a dedicated endpoint first
      try {
        const response = await apiService.getUserStats();
        setStats(response.data);
      } catch (statsError) {
        // If no dedicated stats endpoint, show basic stats
        console.log('No dedicated stats endpoint, using fallback');
        const calculatedStats: UserStats = {
          articles_read: 0,
          events_attended: 0, 
          comments_posted: 0,
          bookmarks_count: 0,
          likes_count: 0
        };

        setStats(calculatedStats);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch user stats:', err);
      setError('Failed to load user statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isAuthenticated]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};