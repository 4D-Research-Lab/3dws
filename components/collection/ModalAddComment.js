import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import useApi from '$hooks/useApi';
import { postNotesComment } from '$api/database';

const initialFormData = {
  comment: '',
};

export default function ModalAddComment({
  showModal,
  onHideModal,
  collectionId,
  annotationId,
  user,
  onSuccessfulSubmit,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);
  const {
    execute: postNotesCommentApi,
    isSuccess,
    error,
  } = useApi(postNotesComment, { stotreData: false });

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
        await postNotesCommentApi(user, collectionId, annotationId, formData);
        onSuccessfulSubmit();
        onHideModal();
        setValidated(false);
      } catch (err) {
        console.error('Failed to add comment:', err);
        setValidated(true);
      }
    }
  };

  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="commentContent">
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
          <Button type="submit" disabled={isSuccess}>
            {isSuccess ? 'Submitted' : 'Submit Comment'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
