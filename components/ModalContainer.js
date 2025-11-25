import { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function ModalContainer({ children }) {
  let [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  return <div>{children({ showModal, handleShowModal, handleHideModal })}</div>;
}
