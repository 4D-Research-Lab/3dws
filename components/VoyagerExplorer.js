// Ensure that the viwer component library is loaded in the app's head
// <script src="https://3d-api.si.edu/resources/js/voyager-explorer.min.js"></script>
import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';




const VoyagerExplorer = forwardRef(
  (
    { id, root, model, uimode, quality, onModelLoaded = null, ...rest },
    ref
  ) => {
const { filename, data } = model;
    const explorerRef = useRef(null);
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
      setIsHydrated(true);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        getModelData: () => {
          return model;
        },
        toggleAnnotations: () => {
          if (explorerRef.current) {
            explorerRef.current.toggleAnnotations();
          }
        },
        setTourStep: (stepIndex) => {
          if (explorerRef.current) {
            explorerRef.current.setTourStep(0, stepIndex, true);
          }
        },
        getTours: () => {
          if (explorerRef.current) {
            return explorerRef.current.application.system.components._objLists
              .CVTours[0]._tours;
          }
        },
      }),
      [model]
    );

    useEffect(() => {
      const currentExplorer = explorerRef.current;
      if (currentExplorer && onModelLoaded) {
        currentExplorer.addEventListener('model-load', onModelLoaded);
        return () => {
          currentExplorer.removeEventListener('model-load', onModelLoaded);
        };
      }
    }, [onModelLoaded]);

    if (!isHydrated) return null;

    return (
      <voyager-explorer
        ref={explorerRef}
        id={id}
document={data ? JSON.stringify(data) : filename}
        root={root}
        uimode={uimode}
        quality={quality}
        {...rest}
      />
    );
  }
);

VoyagerExplorer.displayName = 'VoyagerExplorer';
export default VoyagerExplorer;
