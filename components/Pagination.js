import { useMemo, useCallback } from 'react';
import Pagination from 'react-bootstrap/Pagination';

//pagination component that renders buttons for indexed and numbered pages
//Manages the active page, notifying the parent. Prevents unnecessary rerendering of pagination items

export default function PaginationContainer({
  className,
  pagesAmount,
  onChange,
  activeItem,
  setActiveItem,
}) {
  //Handles page button clicks
  const handleButtonClick = useCallback(
    (index) => {
      //update parent's active page state
      setActiveItem(index);
      //notify parent of change
      onChange(index);
    },
    [setActiveItem, onChange]
  );

  //
  const paginatedItems = useMemo(() => {
        // Create array with length equal to page count
    return Array(pagesAmount)
      .fill(0)
      .map((_, index) => {
         // For each position, create a pagination button
        return (
          <Pagination.Item
            key={index}
            onClick={() => handleButtonClick(index)}
            active={index === activeItem} // Highlight if this is the current page
          >
            {index + 1} {/* Display as 1-based (1, 2, 3...) instead of 0-based */}
          </Pagination.Item>
        );
      });
  }, [pagesAmount, activeItem, handleButtonClick]);

   // Render Bootstrap pagination component with all page items
  return <Pagination className={className}> {paginatedItems} </Pagination>;
}
