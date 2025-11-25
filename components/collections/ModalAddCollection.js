import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import useApi from '$hooks/useApi';
import { createCollection } from '$api/database';
const initialFormData = { title: '', description: '', access: true };

export default function ModalAddCollection({
  user,
  showModal,
  onHideModal,
  onSuccessfulSubmit,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);

  const {
    execute: createCollectionApi,
    isSuccess,
    error,
  } = useApi(createCollection, { storeData: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSwitch = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
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
        await createCollectionApi(user, formData);
        onSuccessfulSubmit();
        onHideModal();
        setFormData(initialFormData);
        setValidated(false);
      } catch (err) {
        console.error('Failed to create collection:', err);
        setValidated(true);
      }
    }
  };

  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom02">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={3}
                placeholder="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom03">
              <Form.Label>Access</Form.Label>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Public"
                name="access"
                checked={formData.access}
                onChange={handleSwitch}
              />
            </Form.Group>
          </Row>
          <Button type="submit">Create Collection</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
