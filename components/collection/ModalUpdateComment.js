import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import useApi from '$hooks/useApi';
import { postNotesCommentUpdate } from '$api/database';

const defaultFormData = {
  comment: '',
};

export default function ModalUpdateComment({
  initialData,
  collectionId,
  commentId,
  showModal,
  onHideModal,
  onSuccessfulSubmit,
}) {
  const [formData, setFormData] = useState(defaultFormData);
  const [validated, setValidated] = useState(false);
  const { execute: postNotesCommentUpdateApi, error } = useApi(
    postNotesCommentUpdate,
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
        await postNotesCommentUpdateApi(collectionId, commentId, formData);
        onSuccessfulSubmit();
        onHideModal();
        setFormData(defaultFormData);
      } catch (err) {
        console.error('Failed to update :', err);
      }
    }
  };

  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="annotationContent">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              name="comment"
              rows={3}
              required
              placeholder="Enter your comment"
              value={formData.comment}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a comment.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Update Comment</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
