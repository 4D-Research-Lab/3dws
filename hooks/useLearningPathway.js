import { useEffect } from 'react';
import useApi from './useApi';
import { fetchLearningPathway } from '../api/database';

export default function useLearningPathway(collectionId) {
  const {
    execute: fetchLearningPathwayApi,
    data: learningPathway,
    error: learningPathwayFetchError,
  } = useApi(fetchLearningPathway);

  useEffect(() => {
    fetchLearningPathwayApi(collectionId);
  }, [collectionId]);

  return {
    learningPathway,
    refetchLearningPathway: () => fetchLearningPathwayApi(collectionId),
    learningPathwayFetchError,
  };
}
