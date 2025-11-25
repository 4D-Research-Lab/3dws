import { useState, useMemo } from 'react';

export default function usePagination(data, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const pageCount = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedData,
    pageCount,
  };
}
