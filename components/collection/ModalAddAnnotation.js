import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import useApi from '$hooks/useApi';
import { postNotesAnnotation } from '$api/database';

export default function ModalAddAnnotation({
  showModal,
  onHideModal,
  collectionId,
  user,
  onSuccessfulSubmit,
}) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [validated, setValidated] = useState(false);
  const {
    execute: postNotesAnnotationApi,
    isSuccess,
    error,
  } = useApi(postNotesAnnotation, { storeData: false });

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
        await postNotesAnnotationApi(user, collectionId, formData);
        onSuccessfulSubmit();
        onHideModal();
        setFormData({ title: '', content: '' });
        setValidated(false);
      } catch (err) {
        console.error('Failed to post comment:', err);
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
          <Form.Group className="mb-3" controlId="commentTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              required
              placeholder="Enter comment title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="commentContent">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              rows={3}
              required
              placeholder="Enter your comment"
              value={formData.content}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a comment.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Submit Comment</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
