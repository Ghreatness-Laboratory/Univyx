import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTournaments();
      setTournaments(response.data.data || response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tournaments:', err);
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return {
    tournaments,
    loading,
    error,
    refetch: fetchTournaments
  };
};

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLeaderboards();
      setLeaderboard(response.data.data || response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leaderboards:', err);
      setError('Failed to load leaderboards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard
  };
};

export const useLeaderboardById = (_id: string) => {
  return {
    leaderboard: null,
    loading: false,
    error: null,
    refetch: () => {}
  };
}