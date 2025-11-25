import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import useApi from '$hooks/useApi';
import { addModelToCollection } from '$api/database';

const defaultFormData = {
  collectionId: '',
};

export default function ModalAddModelToCollection({
  showModal,
  onHideModal,
  model,
  collections,
  onSuccesfullSubmit = null,
}) {
  const [formData, setFormData] = useState(defaultFormData);
  const [validated, setValidated] = useState(false);
  const {
    execute: addModelToCollectionApi,
    isSuccess,
    error,
  } = useApi(addModelToCollection, { storeData: false });

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
        await addModelToCollectionApi(formData.collectionId, model.filename);
        if (onSuccesfullSubmit) {
          onSuccesfullSubmit();
        }
        onHideModal();
        setValidated(false);
        setFormData(defaultFormData);
      } catch (err) {
        setValidated(true);
      }
    }
  };

  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add model to collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Select
            name="collectionId"
            required
            value={formData.collectionId}
            onChange={handleInputChange}
            className="spacing"
          >
            <option value="">Select a collection</option>
            {collections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </Form.Select>
          <Button type="submit" disabled={isSuccess}>
            {isSuccess ? 'Submitted' : 'Submit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
