import { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest, clearAllCache, cancelAllRequests } from '../utils/api';

// Hook for managing API requests with proper cleanup
export const useApiRequest = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isMountedRef.current = false;
  }, []);

  // Execute API request
  const executeRequest = useCallback(async (requestOptions = {}) => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      const response = await apiRequest(endpoint, {
        ...options,
        ...requestOptions,
        signal: abortControllerRef.current.signal
      });

      if (isMountedRef.current) {
        setData(response);
        setLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError') {
        setError(err);
        setLoading(false);
      }
    }
  }, [endpoint, options]);

  // Initial request
  useEffect(() => {
    if (options.autoExecute !== false) {
      executeRequest();
    }

    return cleanup;
  }, [executeRequest, cleanup, options.autoExecute]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    data,
    loading,
    error,
    executeRequest,
    refetch: () => executeRequest({ skipCache: true })
  };
};

// Hook for managing multiple API requests
export const useMultipleApiRequests = (requests) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const executeRequests = useCallback(async (requestOptions = {}) => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const promises = requests.map(async (request) => {
        const { key, endpoint, options = {} } = request;
        try {
          const response = await apiRequest(endpoint, {
            ...options,
            ...requestOptions
          });
          return { key, data: response, error: null };
        } catch (err) {
          return { key, data: null, error: err };
        }
      });

      const responses = await Promise.allSettled(promises);
      const resultsMap = {};

      responses.forEach((response) => {
        if (response.status === 'fulfilled') {
          const { key, data, error } = response.value;
          resultsMap[key] = { data, error };
        }
      });

      if (isMountedRef.current) {
        setResults(resultsMap);
        setLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
      }
    }
  }, [requests]);

  useEffect(() => {
    executeRequests();
  }, [executeRequests]);

  return {
    results,
    loading,
    error,
    refetch: () => executeRequests({ skipCache: true })
  };
};

// Hook for managing cached data with automatic refresh
export const useCachedApiRequest = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchRef = useRef(0);
  const isMountedRef = useRef(true);

  const { cacheDuration = 5 * 60 * 1000, autoRefresh = false } = options;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!isMountedRef.current) return;

    const now = Date.now();
    const shouldFetch = forceRefresh || 
      !data || 
      (now - lastFetchRef.current > cacheDuration) ||
      (autoRefresh && now - lastFetchRef.current > 30000); // Auto refresh every 30 seconds

    if (!shouldFetch) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(endpoint, {
        ...options,
        skipCache: forceRefresh
      });

      if (isMountedRef.current) {
        setData(response);
        lastFetchRef.current = now;
        setLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
      }
    }
  }, [endpoint, options, data, cacheDuration, autoRefresh]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    lastFetch: lastFetchRef.current
  };
};

// Global cache management utilities
export const useCacheManagement = () => {
  const clearCache = useCallback(() => {
    clearAllCache();
  }, []);

  const cancelRequests = useCallback(() => {
    cancelAllRequests();
  }, []);

  return {
    clearCache,
    cancelRequests
  };
};
