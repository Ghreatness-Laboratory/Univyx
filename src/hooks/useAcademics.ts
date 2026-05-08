import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase-client';

export interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  established_year?: number;
  programs?: string[];
  facilities?: string[];
  created_at: string;
  updated_at: string;
}

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Fetch programs for each university
      const universitiesWithPrograms = await Promise.all(
        (data || []).map(async (uni) => {
          const { data: programs } = await supabase
            .from('programs')
            .select('name')
            .eq('university_id', uni.id);
          
          return {
            ...uni,
            programs: programs?.map(p => p.name) || [],
            facilities: [] // Can be populated from another table if needed
          };
        })
      );

      setUniversities(universitiesWithPrograms);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    universities,
    loading,
    error,
    refetch: fetchUniversities
  };
}
