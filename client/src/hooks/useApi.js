import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for API data fetching with loading/error states.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(() => landAPI.list(), []);
 *   const { data, loading, error, refetch } = useApi(() => officerAPI.listCases({ status: 'pending' }), [status]);
 *
 * @param {Function} apiCallFn — A function that returns a Promise (axios call)
 * @param {Array}    deps      — Dependency array (re-fetches when deps change)
 * @param {Object}   options   — { immediate: true } to auto-fetch on mount
 */
const useApi = (apiCallFn, deps = [], options = { immediate: true }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(options.immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCallFn(...args);
      if (mountedRef.current) {
        // Handle both { data: { data: [...] } } and { data: [...] } formats
        const result = response.data?.data ?? response.data;
        setData(result);
        return result;
      }
    } catch (err) {
      if (mountedRef.current) {
        const errMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        setError(errMsg);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCallFn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    if (options.immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: execute, setData };
};

/**
 * Hook for mutations (POST/PUT/DELETE) — no auto-fetch.
 *
 * Usage:
 *   const { execute, loading, error } = useMutation((data) => landAPI.register(data));
 *   const handleSubmit = () => execute(formData);
 */
export const useMutation = (apiCallFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCallFn(...args);
      const result = response.data?.data ?? response.data;
      setData(result);
      return result;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCallFn]);

  return { execute, loading, error, data };
};

export default useApi;
