import { Container, Row } from 'react-bootstrap';
import { useCallback } from 'react';
import useModels from '$hooks/useModels';
import VoyagerExplorerGroupNavigation from '$components/VoyagerExplorerGroupNavigation';
import VoyagerExplorerGroup from '$components/VoyagerExplorerGroup';

export default function TabAddModelsToCollection({collectionId,isUserCollectionOwner, onModelAdded}) {
  const { models, searchModels, currentPage, setCurrentPage, pageCount } =
    useModels();

  const handleSearchInputChange = useCallback(
    (input) => {
      searchModels(input);
    },
    [searchModels]
  );

  return (
    <Container>
      <Row>
          <VoyagerExplorerGroupNavigation
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onSearchChange={handleSearchInputChange}
          />
      </Row>
        <Row md={9}>
          <Container>
            <Row>
              <VoyagerExplorerGroup
                models={models}
                collectionId={collectionId}
                isUserCollectionOwner={isUserCollectionOwner}
                onModelAddedToCollection={onModelAdded}
                showAddUI={true}
              />
            </Row>
          </Container>
        </Row>
    </Container>
  );
}






