import { useState, useCallback } from 'react';
import useLoadingContext from '$hooks/useLoadingContext';

export default function useApi(apiFunction, options = {}) {
  const { storeData = true, onSuccess = null } = options;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { startLoading, stopLoading } = useLoadingContext();

  const execute = useCallback(
    async (...args) => {
      setError(null);
      setIsSuccess(false);
      try {
        startLoading();
        const result = await apiFunction(...args);

        if (result.success) {
          if (storeData && result.data !== undefined) {
            setData(result.data);
          }
          setIsSuccess(true);
          if (onSuccess) {
            onSuccess(result.data);
          }
          return result.data;
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        stopLoading();
      }
    },
    [apiFunction, storeData, startLoading, stopLoading, onSuccess]
  );

  return {
    execute,
    ...(storeData ? { data } : {}),
    error,
    isSuccess,
  };
}
