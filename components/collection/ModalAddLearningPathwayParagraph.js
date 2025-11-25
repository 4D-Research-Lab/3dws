import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Form, Button } from 'react-bootstrap';
import useApi from '$hooks/useApi';
import { postLearningPathwayParagraph, updateLearningPathwayParagraph } from '$api/database';

const initialFormData = {
  heading: '',
  content: '',
  filenameIndex: -1,
  tourStepIndex: -1,
};

export default function ModalAddLearningPathwayParagraph({
  user,
  showModal,
  onHideModal,
  onSuccessfulSubmit,
  collectionModelsTours,
  collectionId,
  initialData,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);
  const [savedTourLinks, setSavedTourLinks] = useState([]);
  const isEditMode = !!initialData;

  const {
    execute: postLearningPathwayParagraphApi,
    isSuccess: isPostSuccess,
    error: postError,
  } = useApi(postLearningPathwayParagraph, { storeData: false });

  const {
    execute: updateLearningPathwayParagraphApi,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useApi(updateLearningPathwayParagraph, { storeData: false });

  useEffect(() => {
    if (initialData) {
      setFormData({
        heading: initialData.heading,
        content: initialData.content,
        filenameIndex: -1,
        tourStepIndex: -1,
      });
      setSavedTourLinks(
        initialData.hyperlinks.map((link) => ({
          modelId: link.model,
          tourStepIndex: link.step,
          modelFilename: collectionModelsTours.find((model) => model.id === link.model)?.filename,
        }))
      );
    }
  }, [initialData, collectionModelsTours]);



  function getCurrentTour(filenameIndex = formData.filenameIndex) {
    if (filenameIndex == null) return null;

    const index = parseInt(filenameIndex);
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= collectionModelsTours.length
    )
      return null;

    const tourModel = collectionModelsTours[index];
    return tourModel?.tour || null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const processedTourLinks = savedTourLinks.map((link) => ({
      model: link.modelId,
      step: link.tourStepIndex,
    }));
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      try {
        if (isEditMode) {
          await updateLearningPathwayParagraphApi(
            collectionId,
            initialData.id,
            formData.heading,
            formData.content,
            processedTourLinks
          );
        } else {
          await postLearningPathwayParagraphApi(
            user,
            collectionId,
            formData.heading,
            formData.content,
            processedTourLinks
          );
        }
        if (onSuccessfulSubmit) onSuccessfulSubmit();
        if (onHideModal) onHideModal();
        // reset the form and tours links
        setFormData(initialFormData);
        setSavedTourLinks([]);
        setValidated(false);
      } catch (err) {
        console.error(`Failed to ${isEditMode ? 'update' : 'post'} learning pathway paragraph:`, err);
        setValidated(true);
      }
    }
  };

  function handleAddTourLink(e) {
    e.preventDefault();

    const filenameIndex = parseInt(formData.filenameIndex);
    const tourStepIndex = parseInt(formData.tourStepIndex);

    if (
      filenameIndex < 0 ||
      tourStepIndex < 0 ||
      filenameIndex >= collectionModelsTours.length
    ) {
      return;
    }

    const selectedModel = collectionModelsTours[filenameIndex];
    if (!selectedModel || !selectedModel.tour || !selectedModel.tour.steps) {
      return;
    }

    const tourStep = selectedModel.tour.steps[tourStepIndex];
    if (!tourStep) {
      return;
    }

    setSavedTourLinks((prevLinks) => [
      ...prevLinks,
      {
        modelFilename: selectedModel.filename,
        modelId: selectedModel.id,
        tourStepIndex: tourStep.index,
      },
    ]);

    setFormData((prevData) => ({
      ...prevData,
      filenameIndex: initialFormData.filenameIndex,
      tourStepIndex: initialFormData.tourStepIndex,
    }));
  }

  function handleDropLastSavedTourLink(e) {
    e.preventDefault();
    if (savedTourLinks.length > 0) {
      setSavedTourLinks((prevLinks) => prevLinks.slice(0, -1));
    }
  }

  function handleHideModal() {
    setFormData(initialFormData);
    setSavedTourLinks([]);
    if (onHideModal) {
      onHideModal();
    }
  }

  return (
    <Modal show={showModal} onHide={handleHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Edit' : 'Add'} Learning Pathway paragraph</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            {/* paragraph heading input */}
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Heading</Form.Label>
              <Form.Control
                type="text"
                value={formData.heading}
                name="heading"
                onChange={(e) => handleInputChange(e)}
              />

            </Form.Group>
          </Row>
          <Row className="mb-3">
            {/* paragraph content input */}
            <Form.Group as={Col} md="12" controlId="validationCustom02">
              <Form.Label>Content</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                value={formData.content}
                name="content"
                onChange={(e) => handleInputChange(e)}
              />

            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col md="12">
              <Form.Group controlId="modelSelect">

                {/* model select input */}
                <Form.Label>Select model</Form.Label>
                <Form.Select
                  value={formData.filenameIndex}
                  onChange={(e) => handleInputChange(e)}
                  name="filenameIndex"
                  aria-label="Select model"
                >
                  <option value={-1}>Select model</option>
                  {collectionModelsTours.map((item, index) => (
                    <option key={index} value={index}>
                      {item.filename}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md="12">
              {/* model tour step select input */}
              <Form.Group controlId="tourStepSelect">
                {(() => {
                  const currentTour = getCurrentTour();
                  return currentTour?.steps?.length > 0 &&
                    formData.filenameIndex !== initialFormData.filenameIndex ? (
                    <>
                      <Form.Label>Select tour step</Form.Label>
                      <Form.Select
                        value={formData.tourStepIndex}
                        name="tourStepIndex"
                        onChange={(e) => handleInputChange(e)}
                        aria-label="Select tour step"
                      >
                        <option value={-1}>Select tour link</option>
                        {currentTour.steps.map((step, index) =>
                          step.titles?.EN ? (
                            <option key={index} value={index}>
                              {step.titles.EN}
                            </option>
                          ) : null
                        )}
                      </Form.Select>
                    </>
                  ) : null;
                })()}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">

            {/* add model tour step to collection button*/}
            <Button
              type="button"
              onClick={handleAddTourLink}
              disabled={
                formData.filenameIndex < 0 || formData.tourStepIndex < 0
              }
              className="mb-2"
            >
              Add tour link
            </Button>
          </Row>
          <Row className="mb-3">
            {/* show tour steps in the collection*/}
            {savedTourLinks.length > 0 && (
              <>
                <h4>Tour Links</h4>
                <ol className="ms-3">
                  {savedTourLinks.map((link, index) => {
                    const selectedModel = collectionModelsTours.find(
                      (model) => model.id === link.modelId
                    );
                    const step = selectedModel?.tour?.steps.find(
                      (step) => step.index === link.tourStepIndex
                    );
                    return (
                      <li key={index}>
                        <span>
                          model: {selectedModel?.filename}, step:{' '}
                          {step?.titles?.EN}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {/* remove last tour step in the collection button*/}
                <Button
                  type="button"
                  onClick={handleDropLastSavedTourLink}
                  disabled={savedTourLinks.length === 0}
                >
                  Remove last tour link
                </Button>
              </>
            )}
          </Row>
          <Row>
            {/* remove last tour step in the collection button*/}
            <Button type="submit">{isEditMode ? 'Update' : 'Submit'} paragraph</Button>
          </Row>
        </Form>
      </Modal.Body>
      {(postError || updateError) && (
        <Modal.Footer>
          <p className="text-danger">
            Error: {postError?.message || updateError?.message}
          </p>
        </Modal.Footer>
      )}
    </Modal>
  );
}
