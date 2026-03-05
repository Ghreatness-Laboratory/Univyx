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
  const [stores, setStores] = useState<any[]>([]);
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

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getStores();
      
      let storeData = [];
      if (Array.isArray(response.data)) {
        storeData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        storeData = response.data.data;
      }
      
      storeData = storeData.map((store: any) => ({
        ...store,
        id: store.id || store._id
      }));
      
      setStores(storeData);
      setError(null);
    } catch (err) {
      console.error('Store fetch error:', err);
      setError('Failed to fetch stores');
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStoreItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getStoreItems();
      
      let itemsData = [];
      if (Array.isArray(response.data)) {
        itemsData = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        itemsData = response.data.results;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        itemsData = response.data.data;
      }
      
      itemsData = itemsData.map((item: any) => ({
        ...item,
        id: item.id || item._id
      }));
      
      setItems(itemsData);
      setPagination({
        count: itemsData.length,
        next: null,
        previous: null,
        page: 1,
        totalPages: 1
      });
      setError(null);
    } catch (err) {
      console.error('Store items fetch error:', err);
      setError('Failed to fetch store items');
      setItems([]);
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
    fetchStores();
  }, [fetchStores]);

  return {
    items,
    stores,
    loading,
    error,
    pagination,
    filters,
    setPage,
    setCategory,
    setSearch,
    createItem,
    refetch: fetchStores
  };
};

