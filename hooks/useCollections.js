import { useEffect, useMemo, useState, useCallback } from 'react';
import { fetchCollections, fetchLearningPathwayIds } from '$api/database';
import useApi from '$hooks/useApi';
import useFuseSearch from '$hooks/useFuseSearch';
import usePagination from '$hooks/usePagination';
import { COLLECTIONS_FUSE_SEARCH_CONFIG, COLLECTIONS_PER_PAGE } from '$config';

export default function useCollections(userName = null) {
  const {
    execute: fetchCollectionsApi,
    data: collectionsData,
    error: errorFetchCollections,
  } = useApi(fetchCollections);

  const {
    execute: fetchLearningPathwayIdsApi,
    data: learningPathwayIds,
    error: errorFetchLearningPathwayIds,
  } = useApi(fetchLearningPathwayIds);

  useEffect(() => {
    fetchCollectionsApi(userName);
    fetchLearningPathwayIdsApi(userName);
  }, []);

  const [searchInput, setSearchInput] = useState('');

  const [filterLearningPathways, setFilterLearningPathways] = useState(false);

  const collectionsDescriptions = useMemo(() => {
    if (!collectionsData) return [];
    return collectionsData.map((collection) => ({
      id: collection.id,
      collectionId: collection.id, // do i need this?
      title: collection.title,
      creator: collection.creator,
      timeStamp: collection.timeStamp,
      lastEdit: collection.lastEdit,
      description: collection.description,
      access: collection.access,
    }));
  }, [collectionsData]);

  const fuse = useFuseSearch(
    collectionsDescriptions,
    COLLECTIONS_FUSE_SEARCH_CONFIG
  );

  const searchedCollections = useMemo(() => {
    if (searchInput === '') {
      return null;
    } else {
      return fuse.search(searchInput).map((v) => v.item);
    }
  }, [searchInput, fuse]);

  const filteredCollections = useMemo(() => {
    let data =
      searchedCollections && searchedCollections.length > 0
        ? searchedCollections
        : collectionsDescriptions;

    if (filterLearningPathways && learningPathwayIds) {
      data = data.filter((collection) =>
        learningPathwayIds.includes(collection.id)
      );
    }

    return data;
  }, [
    searchedCollections,
    collectionsDescriptions,
    filterLearningPathways,
    learningPathwayIds,
  ]);

  const { currentPage, setCurrentPage, paginatedData, pageCount } =
    usePagination(filteredCollections, COLLECTIONS_PER_PAGE);

  const searchCollections = useCallback(
    (input) => {
      setSearchInput(input);
      setCurrentPage(0);
    },
    [setCurrentPage]
  );

  return {
    collections: paginatedData,
    searchCollections,
    currentPage,
    setCurrentPage,
    pageCount,
    refetchCollections: () => fetchCollectionsApi(userName),
    //refetchLearningPathwayIds: fetchLearningPathwayIdsApi,
    errorFetchCollections,
    errorFetchLearningPathwayIds,
    setFilterLearningPathways,
  };
}
