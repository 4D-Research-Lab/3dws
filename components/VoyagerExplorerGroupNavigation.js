import { Stack } from 'react-bootstrap';
import Pagination from '$components/Pagination';
import InputText from '$components/InputText';
import { INPUT_DEBOUNCE_DELAY } from '$config';

export default function VoyagerExplorerGroupNavigation({
  pageCount,
  currentPage,
  setCurrentPage,
  onSearchChange,
}) {
  const handlePaginationChange = (index) => {
    setCurrentPage(index);
  };

  return (
    <Stack>
      <label htmlFor="searchModelsInput"> Search Models </label>
      <i className="mt-1 small">Search through titles</i>
      <InputText
        id="searchModelsInput"
        placeholder={'model title'}
        onChange={onSearchChange}
        onChangeDebounceDelay={INPUT_DEBOUNCE_DELAY}
      />
      <Pagination
        className="mt-3"
        pagesAmount={pageCount}
        onChange={handlePaginationChange}
        activeItem={currentPage}
        setActiveItem={setCurrentPage}
      />
    </Stack>
  );
}
