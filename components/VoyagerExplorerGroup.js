import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Button, Container, Col, Row, Stack } from 'react-bootstrap';
import VoyagerExplorerCard from '$components/VoyagerExplorerCard';
import VoyagerExplorer from '$components/VoyagerExplorer';
import ModalContainer from '$components/ModalContainer';
import ModalAddModelToCollection from '$components/collection/ModalAddModelToCollection';
import { addModelToCollection, deleteModelFromCollection} from '$api/database';
import useApi from '$hooks/useApi';
import { MODELS_REPOSITORY_URL } from '$config';

const VoyagerExplorerGroup = forwardRef(
  (
    {
      models,
      collectionId = null, 
      isUserCollectionOwner=false,
      // should only be passed collections owned by the user.
      collections = null,
      onModelAddedToCollection = null,
      onModelDeletedFromCollection = null,
      onGroupReady = null,
      showAnnotations = false,
      showViewUI=true,
      showAddUI=false,
      showDeleteUI=false,
      showEditUI=false,
    },
    ref
  ) => {
    const [annotationsVisible, setAnnotationsVisible] = useState([]);
    const [explorerRefs, setExplorerRefs] = useState([]);
    const [modelsLoaded, setModelsLoaded] = useState([]);
    const groupReadyRef = useRef(false);

    useEffect(() => {
      setModelsLoaded(new Array(models.length).fill(false));
      setAnnotationsVisible(new Array(models.length).fill(false));
      setExplorerRefs(models.map(() => React.createRef()));
    }, [models]);


    // WIP: this fn should be initiated only if showAddUI && collectionId exist.
    const {
      execute: addModelToCollectionApi,
      isSuccess: addModelFromCollectionSuccess,
      error: addModelFromCollectionError,
    } = useApi(addModelToCollection, { storeData: false, onSuccess:  onModelAddedToCollection});

    
    // WIP: this fn should be initiated only if showDeleteUI && collectionId exist.
    const {
      execute: deleteModelFromCollectionApi,
      isSuccess: deleteModelFromCollectionSuccess,
      error: deleteModelFromCollectionError,
    } = useApi(deleteModelFromCollection, { storeData: false, onSuccess: onModelDeletedFromCollection });

    /* 
      Callback where voyager group is ready. the check is necessary to ensure that imperative handles of this component and its VoyagerExplorer children work properly.
    */ 
    const checkGroupReady = () => {
      const allModelsLoaded = modelsLoaded.length > 0 && modelsLoaded.every((isLoaded) => isLoaded); 
      const allExplorerRefsReady = explorerRefs.length > 0 && explorerRefs.every((ref) => ref.current !== null);
      const groupRefReady = ref.current !== null;

      if (allModelsLoaded && allExplorerRefsReady && groupRefReady && !groupReadyRef.current) {
        groupReadyRef.current = true;
        onGroupReady?.();
      }
    };

    if (ref) {
      checkGroupReady();
    }
    /* 
      show VoyagerExplorers' annotations when its model is loaded 
    */
      const showGroupAnnotations = () => {
        modelsLoaded.forEach((isLoaded, index) => {
          if (
            isLoaded &&
            explorerRefs[index]?.current &&
            showAnnotations !== annotationsVisible[index]
          ) {
            explorerRefs[index].current.toggleAnnotations();
            setAnnotationsVisible((prevState) => {
              const newState = [...prevState];
              newState[index] = showAnnotations;
              return newState;
            });
          }
        });
      };
      showGroupAnnotations();

    const handleModelLoaded = useCallback((event) => {
      const index = parseInt(event.target.id.split('-')[1], 10);
      setModelsLoaded((prevModelsLoaded) => {
        if (prevModelsLoaded[index]) return prevModelsLoaded;
        const updatedModelsLoaded = [...prevModelsLoaded];
        updatedModelsLoaded[index] = true;
        return updatedModelsLoaded;
      });
    }, []);




    useImperativeHandle(ref, () => ({
      setExplorerTourStep: (modelId, tourStep) => {
        const explorerRef = explorerRefs.find(
          (ref) => ref.current && ref.current.getModelData().id === modelId
        );
        if (explorerRef) {
          explorerRef.current.setTourStep(tourStep);
        }
      },
      getExplorerTourStepName: (modelId, tourStep) => {
        const explorerRef = explorerRefs.find(
          (ref) => ref.current && ref.current.getModelData().id === modelId
        );
        if (explorerRef) {
          const tours = explorerRef.current.getTours();
          if (tours && tours.length > 0) {
            return tours[0].steps[tourStep].titles['EN'];
          }
        }
      },
      getExplorersTours: () => {
        if (!explorerRefs.every((ref) => ref.current)) return;

        let tours = [];
        explorerRefs.forEach((ref) => {
          tours.push(ref.current.getTours());
        });
        return tours;
      },
      hasExplorerWithModel: (modelId) => models.some((model) => model.id === modelId),
      getExplorersModels: () => models,
    }));

    return (
      <Container ref={ref}>
        <Row md={12}>
          {models.map(
            (model, index) =>
              model &&
              model.data && (
                <Col xs={12} md={6} key={index}>
                  <VoyagerExplorerCard
                    index={index}
                    filename={model.filename}
                    title={model.data.title}
                    creator={model.data.creator}
                    description={model.data.description}
                  >
                    {/* show 3d model viewer */}
                    <VoyagerExplorer
                      ref={explorerRefs[index]}
                      onModelLoaded={handleModelLoaded}
                      id={`voyager-${index}`}
                      root={MODELS_REPOSITORY_URL}
                      model={model}
                      uimode="None"
                      quality="Thumb"
                    />
                    <Stack direction="horizontal">
                      {/* if collectionId is provided, add the model directly to the collection */}
                      {showAddUI && collectionId && isUserCollectionOwner && (
                           <Button
                              onClick={() => addModelToCollectionApi(collectionId, model.filename)}
                            >
                              Add
                            </Button>
                      )}
                      {/* if collectionId isn't provided the user needs to select collection from the modal */}
                      {!collectionId && showAddUI && collections && collections.length > 0 &&(
                        <ModalContainer>
                          {({
                            showModal,
                            handleShowModal,
                            handleHideModal,
                          }) => (
                            <>
                              <Button
                                onClick={handleShowModal}
                              >
                               Add 
                              </Button>
                              <ModalAddModelToCollection
                                model={model}
                                collections={collections}
                                showModal={showModal}
                                onHideModal={handleHideModal}
                                onSuccesfullSubmit={onModelAddedToCollection}
                              />
                            </>
                          )}
                        </ModalContainer>
                      )}
                      {/* view the model in fullscreen viewer */}
                      {showViewUI && ( 
                        <Button
                          variant="secondary"
                          href={`/explorer.html?root=${MODELS_REPOSITORY_URL}&document=${model.filename}`}>
                          View
                        </Button>
                      )}
                      {/* edit the model */}
                      {showEditUI && isUserCollectionOwner && (
                        <Button
                          variant="secondary"
                          href={`/story.html?root=${MODELS_REPOSITORY_URL}&document=${model.filename}`}>
                          Edit 
                        </Button>
                      )}
                      {/* delete the model from the collection */}
                      {showDeleteUI && collectionId && isUserCollectionOwner && (
                        <Button
                          onClick={() => { 
                            deleteModelFromCollectionApi(collectionId, model.filename); 
                          }}>
                        delete
                        </Button>
                      )}
                      
                    </Stack>
                  </VoyagerExplorerCard>
                </Col>
              )
          )}
        </Row>
      </Container>
    );
  }
);
VoyagerExplorerGroup.displayName = "VoyagerExplorerGroup";
export default VoyagerExplorerGroup;
