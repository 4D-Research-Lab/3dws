import React, { useState, useRef, useMemo} from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import TabCollectionDescription from '$components/collection/TabCollectionDescription';
import TabNotes from '$components/collection/TabNotes';
import TabLearningPathway from '$components/collection/TabLearningPathway';
import TabAddModelsToCollection from '$components/collection/TabAddModelsToCollection';
import VoyagerExplorerGroup from '$components/VoyagerExplorerGroup';

import { useAuth } from '$context/AuthContext';
import useModels from '$hooks/useModels';
import useCollection from '$hooks/useCollection';

export default function CollectionPage() {
  const voyagerExplorerGroupRef = useRef(null);
  const [isVoyagerGroupReady, setIsVoyagerGroupReady] = useState(false);
  const { displayName } = useAuth();

  const {
    collectionId,
    collectionDescription,
    collectionModelsFilenames,
    refetchCollection,
  } = useCollection();

  const isUserCollectionOwner = useMemo(() => collectionDescription.creator?.toLowerCase() === displayName?.toLowerCase(), [collectionDescription, displayName]);

  // show all models in the collection without pagination
  // This is not ideal but necessary to enable interacting with models via the Learning Pathway tab - since Voyager is not reactive
  // furthermore the tours of the models can only be accessed after the models were loaded in the Voyager explorer.
  const modelsPerPage = 999;
  const { models } = useModels(collectionModelsFilenames, modelsPerPage);

  //when voyager components are ready, learning pathway tab is activated
  function handleIsVoyagerGroupReady() {
    setIsVoyagerGroupReady(true);
  };

  //on adding/removing models, collection is refreshed
  function handleCollectionUpdated() {
    refetchCollection();
  };


  return (
    <Container>
      <Row>
        <h1>
          {collectionDescription &&
            'Collections: ' + collectionDescription.title}
        </h1>
      </Row>
      <Row>
        <Col md={6}>
          <VoyagerExplorerGroup
            models={models}
            collectionId={collectionId}
            isUserCollectionOwner={isUserCollectionOwner}
            ref={voyagerExplorerGroupRef}
            showAnnotations={true}
            onGroupReady={handleIsVoyagerGroupReady}
            onModelDeletedFromCollection={handleCollectionUpdated}
            showViewUI={true}
            showEditUI={true}
            showDeleteUI={true}
            showAddUI={false}
          />
        </Col>
        <Col md={6}>
          <Tabs defaultActiveKey="collection-description" id="collection-tabs">
            {/* collection description tab */}
            <Tab
              eventKey="collection-description"
              title="Collection description"
            >
              <TabCollectionDescription
                userName={displayName}
                collectionDescription={collectionDescription}
                collectionId={collectionId}
                refetchCollection={refetchCollection}
              />
            </Tab>
            {/* notes tab */}
            <Tab eventKey="notes" title="Notes">
              <TabNotes collectionId={collectionId} />
            </Tab>
            {/* learning pathway tab */}
            <Tab eventKey="learningPathway" title="Learning Pathway">
              {isVoyagerGroupReady && (
                <TabLearningPathway
                  collectionId={collectionId}
                  collectionDescription={collectionDescription}
                  collectionModelsFilenames={collectionModelsFilenames}
                  voyagerExplorerGroupRef={voyagerExplorerGroupRef}
                />
              )}
            </Tab>
            {/* add models to collection tab */}
            <Tab eventKey="AddModelsToCollection" title="Add models" disabled={!isUserCollectionOwner}>
              <TabAddModelsToCollection 
              collectionId={collectionId}
              isUserCollectionOwner={isUserCollectionOwner}
              onModelAdded={handleCollectionUpdated}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
