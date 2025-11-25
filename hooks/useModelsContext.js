/* 
  useModelsContext is responsible for fetching models' filenames on load, models' metadata and updating the models context.

  exports:
  contextModels - all models saved in ModelsContext

  updateAllModels - function for updating ModelsContext with freshly fetched models' metadata

  findContextModels - function for searching through ModelsContext using models' filenames
*/

import { useContext, useEffect, useCallback } from 'react';
import ModelsContext from '$context/ModelsContext';
import { scrapeSvxFilenames } from '$utils/utils';
import { MODELS_REPOSITORY_URL } from '$config';

export default function useModelsContext() {
  const context = useContext(ModelsContext);
  if (!context) {
    throw new Error('useModelsContext must be used within a FilesProvider');
  }
  const { contextModels, setContextModels } = context;

  useEffect(() => {
    /*
    Fetches all models filenames on page load
    sets the filenames to the global context
  */
    if (contextModels.length === 0) {
      fetchModelsFilenames();
    }
  }, []);

  async function fetchModelsFilenames() {
    /*
      Fetches all models filenames by scraping them from the html
      of the repository.
    */
    try {
      const res = await fetch(MODELS_REPOSITORY_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch, status: ${res.status}`);
      }
      const htmlContent = await res.text();
      const svxFilenames = scrapeSvxFilenames(htmlContent);
      let modelsData = svxFilenames.map((filename, index) => ({
        id: index,
        filename: filename,
      }));
      setContextModels(modelsData);
    } catch (error) {
      console.error('Failed to fetch filenames:', error);
      setError(error.message);
    }
  }

  function updateContextModels(updatedModels) {
    setContextModels((prev) => {
      let next = [...prev];
      updatedModels.forEach((v) => {
        if (v && next[v.id]) {
          next[v.id] = v;
        }
      });
      return next;
    });
  }
  function findContextModels(modelsFilenames) {
    if (modelsFilenames && modelsFilenames.length > 0) {
      return contextModels.filter((model) =>
        modelsFilenames.includes(model.filename)
      );
    } else {
      return [];
    }
  }

  return { contextModels, updateContextModels, findContextModels };
}
