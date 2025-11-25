import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import useApi from '$hooks/useApi';
import { postNotesAnnotationUpdate } from '$api/database';

const defaultFormData = {
  title: '',
  annotation: '',
};

export default function ModalUpdateAnnotation({
  initialData,
  collectionId,
  annotationId,
  showModal,
  onHideModal,
  onSuccessfulSubmit,
}) {
  const [formData, setFormData] = useState(defaultFormData);
  const [validated, setValidated] = useState(false);
  const { execute: postNotesAnnotationUpdateApi, error } = useApi(
    postNotesAnnotationUpdate,
    { storeData: false }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      try {
        await postNotesAnnotationUpdateApi(
          collectionId,
          annotationId,
          formData
        );
        onSuccessfulSubmit();
        onHideModal();
        setFormData(defaultFormData);
      } catch (err) {
        console.error('Failed to update annotation:', err);
      }
    }
  };

  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Annotation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="annotationTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              required
              placeholder="Enter annotation title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="annotationContent">
            <Form.Label>Annotation</Form.Label>
            <Form.Control
              as="textarea"
              name="annotation"
              rows={3}
              required
              placeholder="Enter your annotation"
              value={formData.annotation}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter an annotation.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Update Annotation</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
