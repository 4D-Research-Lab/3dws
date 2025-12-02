import { useState } from 'react';

//container that manages modal visibility state. Only manages show/hide state and passes control to children.

export default function ModalContainer({ children }) {
    // Track whether the modal should be visible
  let [showModal, setShowModal] = useState(false);

  //shows the modal by setting state to true
  const handleShowModal = () => {
    setShowModal(true);
  };

  //hides the modal by setting state to false

  const handleHideModal = () => {
    setShowModal(false);
  };

  // Call children as a function, passing modal state and control handlers
  return <div>{children({ showModal, handleShowModal, handleHideModal })}</div>;
}
