import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase-client';

export interface GamingEvent {
  id: string;
  title: string;
  description: string;
  game_name: string;
  event_type: 'tournament' | 'competition' | 'casual';
  event_date: string;
  end_date?: string;
  location: string;
  image_url?: string;
  prize_pool?: string;
  max_participants?: number;
  current_participants: number;
  registration_deadline?: string;
  rules?: string;
  organizer_id?: string;
  is_featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: string;
  gaming_event_id: string;
  bracket_type: string;
  current_round: number;
  total_rounds: number;
  winner_id?: string;
  gaming_event?: GamingEvent;
}

export interface LeaderboardEntry {
  id: string;
  game: string;
  season?: string;
  player_name: string;
  points: number;
  wins: number;
  rank?: number;
  created_at?: string;
}

export function useGamingEvents() {
  const [events, setEvents] = useState<GamingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGamingEvents();
  }, []);

  const fetchGamingEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gaming_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: string, userId: string, teamName?: string) => {
    try {
      const { error } = await supabase
        .from('gaming_registrations')
        .insert({
          gaming_event_id: eventId,
          user_id: userId,
          team_name: teamName,
          status: 'registered'
        });

      if (error) throw error;

      const event = events.find(e => e.id === eventId);
      if (event) {
        await supabase
          .from('gaming_events')
          .update({ current_participants: event.current_participants + 1 })
          .eq('id', eventId);
      }

      await fetchGamingEvents();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    events,
    loading,
    error,
    registerForEvent,
    refetch: fetchGamingEvents
  };
}

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    tournaments,
    loading,
    error,
    refetch: fetchTournaments
  };
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .order('points', { ascending: false });

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard
  };
}
