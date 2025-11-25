import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import useApi from '$hooks/useApi';
import { fetchCollection } from '$api/database';
import { COLLECTION_PATH_ID_REGEX } from '$config';

export default function useCollection() {
  const router = useRouter();
  const collectionId = useMemo(() => {
    const currentRoute = router.asPath.split('/').pop();
    return extractCollectionIdFromRoute(currentRoute);
  }, [router]);

  const {
    execute: fetchCollectionApi,
    data: collectionData,
    error: fetchCollectionError,
  } = useApi(fetchCollection);

  useEffect(() => {
    /* 
        Load collection data on page load 
      */
    if (collectionId) {
      fetchCollectionApi(collectionId);
    }
  }, [collectionId]);

  const collectionDescription = useMemo(() => {
    return (
      {
        title: collectionData?.title,
        creator: collectionData?.creator,
        timeStamp: collectionData?.timeStamp,
        lastEdit: collectionData?.lastEdit,
        description: collectionData?.description,
        access: collectionData?.access,
      } || {}
    );
  }, [collectionData]);

  const collectionModelsFilenames = useMemo(() => {
    return collectionData?.models || [];
  }, [collectionData]);

  return {
    collectionId,
    collectionDescription,
    collectionModelsFilenames,
    fetchCollectionError,
    refetchCollection: () => fetchCollectionApi(collectionId),
  };
}

function extractCollectionIdFromRoute(path) {
  // expects collection path to come in the form of 'test-collection-$2keDwld41'
  // where the divider string following '-$' is considered the id
  // the divider is defined by the COLLECTION_PATH_ID_DIVIDER in appConfig
  const match = path.match(COLLECTION_PATH_ID_REGEX);

  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}
