import { useState } from 'react';
import { Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import ModalContainer from '$components/ModalContainer';
import ModalAddLearningPathwayParagraph from '$components/collection/ModalAddLearningPathwayParagraph';
import useLearningPathway from '$hooks/useLearningPathway';
import { useAuth } from '$context/AuthContext';
import useApi from '$hooks/useApi';
import { deleteLearningPathwayParagraph } from '$api/database';

export default function TabLearningPathway({
  collectionId,
  collectionDescription,
  voyagerExplorerGroupRef,
}) {
  const { displayName } = useAuth();
  const { learningPathway, refetchLearningPathway, learningPathwayFetchError } =
    useLearningPathway(collectionId);
  const [modalAddParagraphData, setAddParagraphData] = useState(null);

  const { 
    execute: deleteLearningPathwayParagraphApi, 
    error: deleteLearningPathwayParagraphError 
  } = useApi(deleteLearningPathwayParagraph, {
      storeData: false,
      onSuccess: refetchLearningPathway,
    });

  function getCollectionModelsToursData() {
    const tours = voyagerExplorerGroupRef.current?.getExplorersTours?.() || [];
    const collectionModels = voyagerExplorerGroupRef.current?.getExplorersModels?.() || [];

    if (!collectionModels.length || !tours.length) {
      return [];
    }
    
    return collectionModels.map((model, index) => {
      const tour = tours[index]?.[0] || {};
      const steps = tour.steps?.map((step, stepIndex) => ({ index: stepIndex, ...step })) || [];

      return {
        filename: model.filename,
        id: model.id,
        tour: { ...tour, steps },
      };
    });
  }

  const handleShowModal = (item = null) => {
    setAddParagraphData(item);
  };

  const handleHideModal = () => {
    setAddParagraphData(null);
  };

  function handleDeleteParagraph(id) {
    deleteLearningPathwayParagraphApi(id);
  };

  const isCreator = displayName === collectionDescription.creator;

  return (
    <ModalContainer>
      {({ showModal, handleShowModal: handleShowModalContainer, handleHideModal: handleHideModalContainer }) => (
        <Row>
          <Col md="12">
            {(!learningPathway || learningPathway.length < 1) && isCreator ? (
              <div>Create a learning pathway</div>
            ) : (
              <div>
                <h1>Learning Pathway</h1>
                <div>
                  <i>Created by: {collectionDescription.creator}</i>
                </div>
              </div>
            )}
            
            {/* button for adding new content blocks to the learning pathway */}
            {isCreator && (
              <Button onClick={handleShowModalContainer} className="mb-3">Add Paragraph</Button>
            )}
            
            {/* learning pathway content blocks */}
            {learningPathway &&
              learningPathway.map((item) => (
                <div className="learning-pathway" key={item.id}>
                  <div className="spacing">
                    <strong>
                      <h4>
                        {item.heading}
                        <div className="pull-right">
                          {/* edit or delete content blocks */}
                          {isCreator && (
                            <DropdownButton
                              variant="secondary"
                              id="dropdown-basic-button"
                              title="⋮"
                              align="end"
                            >
                              <Dropdown.Item onClick={() => handleShowModal(item)}>
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteParagraph(item.id)}>
                                Delete
                              </Dropdown.Item>
                            </DropdownButton>
                          )}
                        </div>
                      </h4>
                    </strong>
                  </div>
                  <div>{item.content}</div>
                  <hr />
                  {item.hyperlinks.map((hyperlink, index) => (
                    <div key={index} className="spacing">
                      {/* buttons for interacting with parent's VoyagerExplorerGroup */}
                      {voyagerExplorerGroupRef.current.hasExplorerWithModel(
                        hyperlink.model
                      ) && (
                        <button
                          onClick={() => {
                            voyagerExplorerGroupRef.current.setExplorerTourStep(
                              hyperlink.model,
                              hyperlink.step
                            );
                          }}
                        >
                          {voyagerExplorerGroupRef.current.getExplorerTourStepName(
                            hyperlink.model,
                            hyperlink.step
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            {learningPathwayFetchError && (
              <div>
                Error fetching learning pathway: {learningPathwayFetchError.message}
              </div>
            )}
            
            {/* Shared modal for adding and editing paragraphs */}
            <ModalAddLearningPathwayParagraph
              user={displayName}
              showModal={showModal || !!modalAddParagraphData}
              onHideModal={() => {
                handleHideModalContainer();
                handleHideModal();
              }}
              onSuccessfulSubmit={refetchLearningPathway}
              collectionId={collectionId}
              collectionModelsTours={getCollectionModelsToursData()}
              initialData={modalAddParagraphData}
            />
          </Col>
        </Row>
      )}
    </ModalContainer>
  );
}
