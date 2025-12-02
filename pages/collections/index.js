import Link from 'next/link';
import { useMemo } from 'react';
import {
  Row,
  Col,
  Button,
  Stack,
  Form,
  Card,
  ListGroup,
  ListGroupItem,
  Container,
} from 'react-bootstrap';
import InputText from '$components/InputText';
import Pagination from '$components/Pagination';
import ModalContainer from '$components/ModalContainer';
import ModalAddCollection from '$components/collections/ModalAddCollection';
import useCollections from '$hooks/useCollections';
import useApi from '$hooks/useApi';
import { deleteCollection } from '$api/database';
import { useAuth } from '$context/AuthContext';
import { slugify } from '$utils/utils';
import { INPUT_DEBOUNCE_DELAY, COLLECTION_PATH_ID_DIVIDER } from '$config';
import { FaTrashAlt } from 'react-icons/fa';

export default function Page() {
  // Get current user's display name for authentication checks
  const { displayName } = useAuth();

  // Check if user is logged in
  const isAuthenticated = useMemo(() => displayName ? true : false, [displayName]);


  // Get collections data and control functions from useCollections hook
  const {
    collections,
    searchCollections,
    currentPage,
    setCurrentPage,
    pageCount,
    refetchCollections,
    setFilterLearningPathways,
  } = useCollections();


  // Set up delete collection API call with auto-refetch on success
  const { execute: deleteCollectionApi, error: deleteCollectionError } = useApi(
    deleteCollection,
    {
      storeData: false,
      onSuccess: () => refetchCollections(),
    }
  );

  // Handle search input changes - triggers collection filtering
  const handleSearchInputChange = (value) => {
    searchCollections(value);
  };

  // Handle pagination navigation
  const handlePaginationChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Toggle filter to show only learning pathways
  const handleToggleLearningPathway = (event) => {
    setFilterLearningPathways((prev) => !prev);
  };

  // Refresh collections list after successfully adding a new collection
  const handleSuccesfulSubmit = (event) => {
    refetchCollections();
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Collections</h1>
        </Col>
      </Row>
      <Row>
        {/* Left column: Search, filters, and add collection controls */}
        <Col md={3}>
          <Stack>
            {/* Add Collection button - only visible when authenticated */}
            {isAuthenticated && (
              <ModalContainer>
                {({ showModal, handleShowModal, handleHideModal }) => (
                  <>
                    <Button onClick={handleShowModal}>Add Collection</Button>
                    <ModalAddCollection
                      showModal={showModal}
                      user={displayName}
                      onHideModal={handleHideModal}
                      onSuccessfulSubmit={handleSuccesfulSubmit}
                    />
                  </>
                )}
              </ModalContainer>
            )}

            {/* Search input with debounce (the microdelay that prevents searching after every single input character) */}
            <label htmlFor="searchCollectionsInput">Search Collections</label>
            <i className="mt-1 small">Search through titles and descriptions</i>
            <InputText
              id="searchCollectionsInput"
              placeholder={'collection title or description'}
              onChange={handleSearchInputChange}
              onChangeDebounceDelay={INPUT_DEBOUNCE_DELAY}
            />

            {/* Pagination controls */}
            <Pagination
              className="mt-3"
              pagesAmount={pageCount}
              onChange={handlePaginationChange}
              activeItem={currentPage}
              setActiveItem={setCurrentPage}
            />

            {/* Learning pathway filter toggle */}
            <Form>
              <Form.Check
                type="switch"
                id="learning-pathway-toggle"
                label="Show only learning pathways"
                onChange={(e) => handleToggleLearningPathway(e)}
              />
            </Form>
          </Stack>
        </Col>

        {/* Right column: Collection cards grid */}
        <Col md={9}>
          <Container>
            <Row>
              {collections.map((item) => {
                // Show public collections (access: true) to everyone
                // Show private collections (access: false) only to authenticated users
                if (
                  item.access == true ||
                  (item.access == false) & isAuthenticated
                ) {
                  return (
                    <Col className="spacing" sm={4} key={item.timeStamp}>
                      <Card className="collection-press">
                        {/* Card image links to collection detail page */}
                        <Link
                          href={`collections/${slugify(item.title) + COLLECTION_PATH_ID_DIVIDER + item.id}`}
                          passHref
                        >
                          <Card.Img variant="top" src="placeholder.jpg" />
                        </Link>

                        {/* Card body links to collection detail page */}
                        <Link
                          href={`collections/${slugify(item.title) + COLLECTION_PATH_ID_DIVIDER + item.id}`}
                          passHref
                        >
                          <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>{item.description}</Card.Text>
                          </Card.Body>
                        </Link>

                        {/* Creator name and delete button (only for collection owner) */}
                        <ListGroup className="list-group-flush">
                          <ListGroupItem>
                            {item.creator}
                            {/* Show delete button only if current user is the creator */}
                            {item.creator.toLowerCase() ===
                              displayName?.toLowerCase() && (
                                <Button
                                  onClick={() => deleteCollectionApi(item.id)}
                                  variant="secondary"
                                  className="pull-right"
                                  size="sm"
                                >
                                  <FaTrashAlt />
                                </Button>
                              )}
                          </ListGroupItem>
                        </ListGroup>
                      </Card>
                    </Col>
                  );
                }
              })}
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
