import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiResponse, PageResponse } from '../type/ApiResponse';

interface UsePaginatedDataOptions<T> {
  fetchData: (pageNum: number) => Promise<ApiResponse<PageResponse<T>>>;
  searchData?: (cond: any, pageNum: number) => Promise<ApiResponse<PageResponse<T>>>;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  goToPage: (page: number) => void;
  search: (cond: any) => void;
  resetSearch: () => void;
  isSearching: boolean;
  refresh: () => void;
}

export function usePaginatedData<T>({
  fetchData,
  searchData,
}: UsePaginatedDataOptions<T>): UsePaginatedDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCond, setSearchCond] = useState<any>(null);

  // 함수 참조 안정화
  const fetchDataRef = useRef(fetchData);
  const searchDataRef = useRef(searchData);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 참조 업데이트 (렌더링에 영향 없음)
  useEffect(() => {
    fetchDataRef.current = fetchData;
    searchDataRef.current = searchData;
  });

  const loadPage = useCallback(async (page: number, searchCondition?: any) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const controller = abortControllerRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const res = searchCondition && searchDataRef.current
        ? await searchDataRef.current(searchCondition, page)
        : await fetchDataRef.current(page);

      if (!controller.signal.aborted) {
        setData(res.data.content);
        setTotalPages(res.data.totalPages);
        setCurrentPage(page);
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // 초기 로드 및 fetchData 변경 시 재로드
  useEffect(() => {
    loadPage(1);
    return () => abortControllerRef.current?.abort();
  }, [fetchData, loadPage]);

  const goToPage = useCallback((page: number) => {
    loadPage(page, isSearching ? searchCond : undefined);
  }, [loadPage, isSearching, searchCond]);

  const search = useCallback((cond: any) => {
    setSearchCond(cond);
    setIsSearching(true);
    loadPage(1, cond);
  }, [loadPage]);

  const resetSearch = useCallback(() => {
    setSearchCond(null);
    setIsSearching(false);
    loadPage(1);
  }, [loadPage]);

  const refresh = useCallback(() => {
    loadPage(currentPage, isSearching ? searchCond : undefined);
  }, [loadPage, currentPage, isSearching, searchCond]);

  return {
    data,
    totalPages,
    currentPage,
    isLoading,
    error,
    goToPage,
    search,
    resetSearch,
    isSearching,
    refresh,
  };
}
