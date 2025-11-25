import React from 'react';
import { Button } from 'react-bootstrap';
import ListCollectionDescription from '$components/collection/ListCollectionDescription';
import ModalContainer from '$components/ModalContainer';
import ModalEditCollectionDescription from '$components/collection/ModalEditCollectionDescription';

export default function TabCollectionDescription({
  userName,
  collectionDescription,
  collectionId,
  refetchCollection,
}) {
  return (
    <>
      <ListCollectionDescription data={collectionDescription} />
      {userName === collectionDescription.creator && (
        <ModalContainer>
          {({ showModal, handleShowModal, handleHideModal }) => {
            return (
              <>
                <Button onClick={handleShowModal}> Edit description</Button>
                <ModalEditCollectionDescription
                  description={{
                    title: collectionDescription.title ?? '',
                    description: collectionDescription.description ?? '',
                    access: collectionDescription?.access ?? null,
                  }}
                  collectionId={collectionId}
                  showModal={showModal}
                  onHideModal={handleHideModal}
                  onSuccessfulSubmit={refetchCollection}
                />
              </>
            );
          }}
        </ModalContainer>
      )}
    </>
  );
}
