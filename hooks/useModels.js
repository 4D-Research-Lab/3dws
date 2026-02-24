import { useEffect, useState, useMemo, useCallback } from 'react';
import useModelsContext from '$hooks/useModelsContext';
import useFuseSearch from '$hooks/useFuseSearch';
import usePagination from '$hooks/usePagination';
import {
  FUSE_SEARCH_CONFIG,
  MODELS_PER_PAGE,
  MODELS_REPOSITORY_URL,
} from '$config';

export default function useModels(filterModelsFilenames = null, modelsPerPage=MODELS_PER_PAGE) {
  const { contextModels, updateContextModels, findContextModels } =
    useModelsContext();

  const allModels = useMemo(() => {
    return filterModelsFilenames && Array.isArray(filterModelsFilenames)
      ? findContextModels(filterModelsFilenames)
      : contextModels;
  }, [contextModels, filterModelsFilenames]);
  console.log("ALL MODELS:", allModels);

  const fuse = useFuseSearch(allModels, FUSE_SEARCH_CONFIG);
  const [searchInput, setSearchInput] = useState('');
  const [updatedModels, setUpdatedModels] = useState([]);
  // WIP: this should be set to a global context probably
  const [error, setError] = useState(null);

  const searchedModels = useMemo(() => {
    if (searchInput === '') {
      return null;
    } else {
      return fuse.search(searchInput).map((v) => v.item);
    }
  }, [searchInput, fuse]);

  const currentData = useMemo(() => {
    if (searchInput === '') {
      return allModels;
    }
    return searchedModels || [];
  }, [searchedModels, allModels, searchInput]);
  

  const { currentPage, setCurrentPage, paginatedData, pageCount } =
    usePagination(currentData, modelsPerPage);

  useEffect(() => {
    if (paginatedData.length > 0) {
      fetchAndUpdateModelsData(paginatedData);
    } else {
      setUpdatedModels([]);
    }
  }, [paginatedData]);

  async function fetchAndUpdateModelsData(modelsData) {
    const needsUpdate = modelsData.filter(
      (model) => !model.hasOwnProperty('data') || model.data === null
    );
    if (needsUpdate.length > 0) {
      const filenames = needsUpdate.map((model) => model.filename);
      try {
        const fetchedData = await fetchModels(filenames);

        if (!fetchedData || fetchedData.length === 0) {
          console.error('Failed to fetch model data');
          return;
        }

        const dataMap = fetchedData.reduce((map, data, index) => {
          if (data) {
            map[needsUpdate[index].filename] = data;
          }
          return map;
        }, {});

        const updatedModelsData = modelsData.map((model) => {
          const data = dataMap[model.filename];
          return data ? { ...model, data } : model;
        });

        setUpdatedModels(updatedModelsData);
        updateContextModels(updatedModelsData);
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
    } else {
      setUpdatedModels(modelsData);
    }
  }

  async function fetchModels(filenames) {
    /* 
      helper function for fetching models' svx metadata from the repository
    */
    const dataPromises = filenames.map(async (filename) => {
      const url = new URL(filename, MODELS_REPOSITORY_URL);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch metadata for ${filename}, status: ${response.status}`
          );
        }
        const json = await response.json();
        const title = json.title
          ? json.title
          : filename.replace('.svx.json', '');
        return { ...json, title: title };
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
        setError(error.message);
        return null;
      }
    });
    return Promise.all(dataPromises);
  }

  const searchModels = useCallback(
    (input) => {
      setSearchInput(input);
      setCurrentPage(0);
    },
    [setCurrentPage]
  );

  return {
    models: updatedModels,
    searchModels,
    currentPage,
    setCurrentPage,
    pageCount,
  };
}
