import { useEffect } from 'react';
import { fetchNotesComments, fetchNotesAnnotations } from '../api/database';
import useApi from './useApi';

export default function useNotes(collectionId) {
  const {
    execute: fetchNotesAnnotationsApi,
    data: annotations,
    error: annotationsFetchError,
  } = useApi(fetchNotesAnnotations);

  const {
    execute: fetchNotesCommentsApi,
    data: comments,
    error: commentsFetchError,
  } = useApi(fetchNotesComments);

  useEffect(() => {
    fetchNotesAnnotationsApi(collectionId);
    fetchNotesCommentsApi(collectionId);
  }, [fetchNotesAnnotationsApi, fetchNotesCommentsApi]);

  return {
    annotations,
    comments,
    refetchComments: () => fetchNotesCommentsApi(collectionId),
    refetchAnnotations: () => fetchNotesAnnotationsApi(collectionId),
    annotationsFetchError,
    commentsFetchError,
  };
}
