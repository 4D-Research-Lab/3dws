import React, { useState, useEffect } from 'react';
import { postCollectionDescription } from '$api/database';
import useApi from '$hooks/useApi';
import { Form, Button, Modal, Alert } from 'react-bootstrap';

const defaultFormData = {
  title: '',
  description: '',
  access: null,
};

export default function ModalEditCollectionDescription({
  collectionId,
  showModal,
  onHideModal,
  onSuccessfulSubmit,
  description,
}) {
  const [formData, setFormData] = useState(description || defaultFormData);
  const [validated, setValidated] = useState(false);

  const {
    execute: postCollectionDescriptionData,
    isSuccess,
    error,
  } = useApi(postCollectionDescription, { storeData: false });

  useEffect(() => {
    // Update form data when description prop changes
    if (description) {
      setFormData(description);
    }
  }, [description]);

  useEffect(() => {
    if (isSuccess) {
      onHideModal();
    }
  }, [isSuccess, onHideModal]);

  const updateFormData = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'access' ? (value === '' ? null : value === 'true') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        // Remove undefined fields before submitting
        const dataToSubmit = Object.fromEntries(
          Object.entries(formData).filter(([_, v]) => v !== undefined)
        );
        await postCollectionDescriptionData(collectionId, dataToSubmit);
        onSuccessfulSubmit();
      } catch (err) {
        console.error('Failed to post description:', err);
      }
    }

    setValidated(true);
  };

  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Collection Description</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={updateFormData}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a title.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              name="description"
              value={formData.description || ''}
              onChange={updateFormData}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a description.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAccess">
            <Form.Label>Access</Form.Label>
            <Form.Select
              name="access"
              value={formData.access === null ? '' : formData.access.toString()}
              onChange={updateFormData}
            >
              <option value="">Select access</option>
              <option value="true">Public</option>
              <option value="false">Private</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" disabled={isSuccess}>
            {isSuccess ? 'Submitted' : 'Submit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
