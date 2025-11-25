import { useMemo, useCallback } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function PaginationContainer({
  className,
  pagesAmount,
  onChange,
  activeItem,
  setActiveItem,
}) {
  const handleButtonClick = useCallback(
    (index) => {
      setActiveItem(index);
      onChange(index);
    },
    [setActiveItem, onChange]
  );

  const paginatedItems = useMemo(() => {
    return Array(pagesAmount)
      .fill(0)
      .map((_, index) => {
        return (
          <Pagination.Item
            key={index}
            onClick={() => handleButtonClick(index)}
            active={index === activeItem}
          >
            {index + 1}
          </Pagination.Item>
        );
      });
  }, [pagesAmount, activeItem, handleButtonClick]);

  return <Pagination className={className}> {paginatedItems} </Pagination>;
}
