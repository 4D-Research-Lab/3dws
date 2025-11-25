import React, {useMemo} from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import ModalContainer from '$components/ModalContainer';
import ModalAddAnnotation from '$components/collection/ModalAddAnnotation';
import ModalAddComment from '$components/collection/ModalAddComment';
import ModalUpdateAnnotation from '$components/collection/ModalUpdateAnnotation';
import ModalUpdateComment from '$components/collection/ModalUpdateComment';
import useNotes from '$hooks/useNotes';
import useApi from '$hooks/useApi';
import { deleteNotesAnnotation, deleteNotesComment } from '$api/database';
import { useAuth } from '$context/AuthContext';

export default function TabNotes({ collectionId }) {
  const { displayName } = useAuth();
  const isAuthenticated = useMemo(() => displayName ? true : false, [displayName]);
  const {
    annotations,
    comments,
    refetchAnnotations,
    refetchComments,
    annotationsFetchError,
    commentsFetchError,
  } = useNotes(collectionId);

  const {
    execute: deleteNotesAnnotationApi,
    error: deleteNotesAnnotationError,
  } = useApi(deleteNotesAnnotation, {
    storeData: false,
    onSuccess: refetchAnnotations,
  });

  const { execute: deleteNotesCommentApi, error: deleteNotesCommentError } =
    useApi(deleteNotesComment, {
      storeData: false,
      onSuccess: refetchComments,
    });

  return (
    <>
      {/* Button for adding new annotations */}
      {isAuthenticated && (
      <ModalContainer>
        {({ showModal, handleShowModal, handleHideModal }) => (
          <>
            <Button onClick={handleShowModal} className="my-3">
              Add Annotation
            </Button>
            <ModalAddAnnotation
              showModal={showModal}
              user={displayName}
              onHideModal={handleHideModal}
              collectionId={collectionId}
              onSuccessfulSubmit={refetchAnnotations}
            />
          </>
        )}
      </ModalContainer>
      )}

      {(!annotations || annotations.length === 0) && (
        <div>Add or respond to notes</div>
      )}

      <Container className="px-0">
        <Row>
          <Col md="12">
            {/* Annotations list */}
            {annotations &&
              annotations.length > 0 &&
              annotations.map((annotation) => (
                <div key={annotation.id}>
                  <div className="spacing">
                    <strong>{annotation.title}</strong>
                    <div className="pull-right">
                      {/* Annotation dropdown menu */}
                      {displayName && (
                        <DropdownButton
                          variant="secondary"
                          id="dropdown-basic-button"
                          title="⋮"
                          align="end"
                        >
                          {displayName === annotation.name && (
                            <ModalContainer>
                              {({
                                showModal,
                                handleShowModal,
                                handleHideModal,
                              }) => (
                                <>
                                  <Dropdown.Item onClick={handleShowModal}>
                                    Edit
                                  </Dropdown.Item>
                                  {showModal && (
                                    <ModalUpdateAnnotation
                                      initialData={{
                                        annotation: annotation.annotation,
                                        title: annotation.title,
                                      }}
                                      annotationId={annotation.id}
                                      collectionId={collectionId}
                                      user={displayName}
                                      showModal={showModal}
                                      onHideModal={handleHideModal}
                                      onSuccessfulSubmit={() => {
                                        refetchAnnotations();
                                        handleHideModal();
                                      }}
                                    />
                                  )}
                                </>
                              )}
                            </ModalContainer>
                          )}
                          <ModalContainer>
                            {({
                              showModal,
                              handleShowModal,
                              handleHideModal,
                            }) => (
                              <>
                                <Dropdown.Item onClick={handleShowModal}>
                                  Add comment
                                </Dropdown.Item>
                                {showModal && (
                                  <ModalAddComment
                                    showModal={showModal}
                                    user={displayName}
                                    onHideModal={handleHideModal}
                                    annotationId={annotation.id}
                                    collectionId={collectionId}
                                    onSuccessfulSubmit={() => {
                                      refetchComments();
                                      handleHideModal();
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </ModalContainer>
                          {displayName === annotation.name && (
                            <Dropdown.Item
                              onClick={() =>
                                deleteNotesAnnotationApi(annotation.id)
                              }
                            >
                              Delete
                            </Dropdown.Item>
                          )}
                        </DropdownButton>
                      )}
                    </div>
                  </div>
                  <div>
                    <i>{annotation.name}</i>
                  </div>
                  <div className="spacing">
                    <i>{annotation.date}</i>
                  </div>
                  <div>{annotation.annotation}</div>
                  <hr />
                  {/* Comments list for each annotation */}
                  {comments && (
                    <Container>
                      {comments
                        .filter(
                          (comment) => comment.annotationId === annotation.id
                        )
                        .map((comment) => (
                          <Row key={comment.id}>
                            <Col md={{ offset: 2 }}>
                              <div>
                                <i>
                                  {comment.name} {comment.date}
                                </i>
                                <div className="pull-right">
                                  {/* Comment dropdown menu */}
                                  {displayName === comment.name && (
                                    <DropdownButton
                                      variant="secondary"
                                      id="dropdown-basic-button-comment"
                                      title="⋮"
                                      align="end"
                                    >
                                      {displayName === comment.name && (
                                        <ModalContainer>
                                          {({
                                            showModal,
                                            handleShowModal,
                                            handleHideModal,
                                          }) => (
                                            <>
                                              <Dropdown.Item
                                                onClick={handleShowModal}
                                              >
                                                Edit comment
                                              </Dropdown.Item>
                                              {showModal && (
                                                <ModalUpdateComment
                                                  user={displayName}
                                                  initialData={comment}
                                                  collectionId={collectionId}
                                                  commentId={comment.id}
                                                  showModal={showModal}
                                                  onHideModal={handleHideModal}
                                                  onSuccessfulSubmit={() => {
                                                    refetchComments();
                                                    handleHideModal();
                                                  }}
                                                />
                                              )}
                                            </>
                                          )}
                                        </ModalContainer>
                                      )}
                                      <Dropdown.Item
                                        onClick={() =>
                                          deleteNotesCommentApi(comment.id)
                                        }
                                      >
                                        Delete
                                      </Dropdown.Item>
                                    </DropdownButton>
                                  )}
                                </div>
                              </div>
                              <div>{comment.comment}</div>
                              <div className="spacing"></div>
                              <hr />
                            </Col>
                          </Row>
                        ))}
                    </Container>
                  )}
                </div>
              ))}
          </Col>
        </Row>
      </Container>

      {/* Error messages */}
      {annotationsFetchError && (
        <div>Error fetching annotations: {annotationsFetchError.message}</div>
      )}
      {commentsFetchError && (
        <div>Error fetching comments: {commentsFetchError.message}</div>
      )}
      {deleteNotesAnnotationError && (
        <div>
          Error deleting annotation: {deleteNotesAnnotationError.message}
        </div>
      )}
      {deleteNotesCommentError && (
        <div>Error deleting comment: {deleteNotesCommentError.message}</div>
      )}
    </>
  );
}
