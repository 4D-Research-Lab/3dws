import { Container, Row, Col } from 'react-bootstrap';
import React, { useCallback, useMemo } from 'react';
import { useAuth } from '$context/AuthContext';
import useCollections from '$hooks/useCollections';
import useModels from '$hooks/useModels';
import VoyagerExplorerGroupNavigation from '$components/VoyagerExplorerGroupNavigation';
import VoyagerExplorerGroup from '$components/VoyagerExplorerGroup';

// Checks if user is logged in based on displayName. Data retrieved from AuthContext
export default function ModelsPage() {
  const { displayName } = useAuth();
  const isAuthenticated = useMemo(() => displayName ? true : false, [displayName]);

  // Destructuring, values returned from hooks/useModels can be used below
  const { models, searchModels, currentPage, setCurrentPage, pageCount } =
    useModels();

// Destructuring, values returned from hooks/usecollections, based on account that's logged in, can be used below
  const { collections, refetchCollections } = useCollections(displayName);

  //Handles search input and triggers model search. Input UI found in /components/VoyagerExplorerGroupNavigation
  const handleSearchInputChange = useCallback(
    (input) => {
      searchModels(input);
    },
    [searchModels]
  );

  //when a model is added, collection is refreshed
  const handleModelAddedToCollection = useCallback(() => {
    refetchCollections();
  }, [refetchCollections]);


  return (
    <Container>
      <Row>
        <h1>Models</h1>
      </Row>
      <Row>
        <Col md={3}>
          <VoyagerExplorerGroupNavigation
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onSearchChange={handleSearchInputChange}
          />
        </Col>
        <Col md={9}>
          <Container>
            <Row>
              {models && models.length > 0 && (
              <VoyagerExplorerGroup
                models={models}
                collections={collections}
                onModelAddedToCollection={handleModelAddedToCollection}
                showAddUI={isAuthenticated}
              />
              )}
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
