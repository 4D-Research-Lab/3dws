import { useContext, useCallback, useRef, useEffect } from 'react';
import LoadingContext from '$context/LoadingContext';

export default function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }

  const { isLoading, setIsLoading } = context;
  const loadingCountRef = useRef(0);

  const startLoading = useCallback(() => {
    loadingCountRef.current += 1;
    setIsLoading(true);
  }, [setIsLoading]);

  const stopLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    if (loadingCountRef.current === 0) {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    return () => {
      if (loadingCountRef.current > 0) {
        loadingCountRef.current = 0;
        setIsLoading(false);
      }
    };
  }, [setIsLoading]);

  return { isLoading, startLoading, stopLoading };
}
