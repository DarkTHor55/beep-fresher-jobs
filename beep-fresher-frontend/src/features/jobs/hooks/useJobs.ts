import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchJobs } from '../../../lib/api';
import type { PageResponse, SearchParams } from '../../../lib/types';

const DEFAULT_PAGE_SIZE = 25;
const DEBOUNCE_MS = 300;
const SLOW_LOAD_MS = 2000;

export function useJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [slowLoad, setSlowLoad] = useState(false);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = searchParams.get('q') || undefined;
  const role = searchParams.get('role') || undefined;
  const city = searchParams.get('city') || undefined;
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE;

  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    slowTimerRef.current = setTimeout(() => setDebouncedQ(q), DEBOUNCE_MS);
    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    };
  }, [q]);

  useEffect(() => {
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    slowTimerRef.current = setTimeout(() => setSlowLoad(true), SLOW_LOAD_MS);
    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    };
  }, [debouncedQ, role, city, page]);

  const params: SearchParams = {
    q: debouncedQ || undefined,
    role: role || undefined,
    city: city || undefined,
    page,
    pageSize,
  };

  const query = useQuery<PageResponse, Error>({
    queryKey: ['jobs', params],
    queryFn: () => fetchJobs(params),
    staleTime: 30_000,
  });

  const updateUrl = useCallback(
    (nextParams: Partial<{ [K in keyof SearchParams]: SearchParams[K] | null }>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(nextParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setRole = (role: string | null) => {
    updateUrl({ role, page: 1 });
  };

  const setCity = (city: string | null) => {
    updateUrl({ city, page: 1 });
  };

  const setPage = (page: number) => {
    updateUrl({ page });
  };

  const setQ = (q: string) => {
    updateUrl({ q, page: 1 });
  };

  useEffect(() => {
    if (!query.data) return;
    const lastPage = Math.max(1, query.data.totalPages);
    if (page > lastPage) updateUrl({ page: lastPage });
  }, [query.data?.totalPages, page, updateUrl]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    slowLoad,
    params: {
      q: debouncedQ,
      role,
      city,
      page,
      pageSize,
    },
    actions: {
      setRole,
      setCity,
      setPage,
      setQ,
    },
  };
}


