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
      
      const storeData = Array.isArray(response.data) ? response.data : response.data.results || [];
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
      setError('Failed to fetch store items');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<StoreFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchStoreItems(updatedFilters);
  }, [filters, fetchStoreItems]);

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
  }, []);

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

    refetch: () => fetchStoreItems()
  };
};

