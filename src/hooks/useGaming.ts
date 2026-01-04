import { useState, useEffect } from 'react';
// import apiService from '../services/api';

export const useTournaments = () => {
  const [tournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const fetchTournaments = async () => {
    setLoading(false);
    // TODO: Implement when gaming endpoints are available
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
  const [leaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(false);
    // TODO: Implement when gaming endpoints are available
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