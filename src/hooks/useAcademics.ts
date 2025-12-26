import { useState, useEffect } from 'react';
import { University, PaginatedResponse } from '../types/api';
import apiService from '../services/api';

export const useUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUniversities();
      const universitiesData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setUniversities(universitiesData);
      setError(null);
    } catch (err: any) {
      console.error('Universities fetch error:', err);
      if (err.response?.status === 401) {
        setError('Authentication required');
      } else if (err.response?.status === 404) {
        setError('Universities endpoint not found');
      } else {
        setError('Failed to fetch universities');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  return {
    universities,
    loading,
    error,
    refetch: fetchUniversities
  };
};

export const useUniversity = (id: number) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversity = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUniversity(id);
      setUniversity(response.data);
      setError(null);
    } catch (err: any) {
      console.error('University fetch error:', err);
      setError('Failed to fetch university');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUniversity();
    }
  }, [id]);

  return {
    university,
    loading,
    error,
    refetch: fetchUniversity
  };
};

export const useUniversityResources = (universityId: number) => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUniversityResources(universityId);
      setResources(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Resources fetch error:', err);
      setError('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (universityId) {
      fetchResources();
    }
  }, [universityId]);

  return {
    resources,
    loading,
    error,
    refetch: fetchResources
  };
};