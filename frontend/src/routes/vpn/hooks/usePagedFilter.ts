import { useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE } from '../utils';

export interface UsePagedFilterResult<T> {
  search: string;
  setSearch: (value: string) => void;
  page: number;
  totalPages: number;
  filteredCount: number;
  pagedRows: T[];
  onPrev: () => void;
  onNext: () => void;
}

export function usePagedFilter<T>(
  rows: T[],
  matches: (row: T, query: string) => boolean,
): UsePagedFilterResult<T> {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => matches(row, q));
  }, [rows, search, matches]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  return {
    search,
    setSearch,
    page: currentPage,
    totalPages,
    filteredCount: filtered.length,
    pagedRows,
    onPrev: () => setPage((p) => Math.max(1, p - 1)),
    onNext: () => setPage((p) => Math.min(totalPages, p + 1)),
  };
}
