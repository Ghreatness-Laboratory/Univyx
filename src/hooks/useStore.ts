import { useState, useEffect, useCallback } from 'react';
import { StoreItem, PaginatedResponse } from '../types/api';
import apiService from '../services/api';

interface StoreFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useStore = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    page: 1,
    totalPages: 1
  });
  const [filters, setFilters] = useState<StoreFilters>({ page: 1, limit: 20 });

  const fetchStoreItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getStoreItems();
      
      // Ensure we always get an array
      let storeData = [];
      if (Array.isArray(response.data)) {
        storeData = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        storeData = response.data.results;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        storeData = response.data.data;
      }
      
      setItems(storeData);
      setPagination({
        count: storeData.length,
        next: null,
        previous: null,
        page: 1,
        totalPages: 1
      });
      setError(null);
    } catch (err) {
      console.error('Store fetch error:', err);
      setError('Failed to fetch store items');
      setItems([]); // Ensure items is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<StoreFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  }, [filters]);

  const setPage = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  const setCategory = useCallback((category: string | undefined) => {
    updateFilters({ category, page: 1 });
  }, [updateFilters]);

  const setSearch = useCallback((search: string | undefined) => {
    updateFilters({ search, page: 1 });
  }, [updateFilters]);

  const createItem = useCallback(async (data: Partial<StoreItem>) => {
    try {
      await apiService.createStoreItem(data);
      await fetchStoreItems();
    } catch (err) {
      setError('Failed to create store item');
    }
  }, [fetchStoreItems]);

  useEffect(() => {
    fetchStoreItems();
  }, [fetchStoreItems]);

  return {
    items,
    loading,
    error,
    pagination,
    filters,
    setPage,
    setCategory,
    setSearch,
    createItem,
    refetch: fetchStoreItems
  };
};

