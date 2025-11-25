export const MODELS_REPOSITORY_URL =
  'https://voyager-data.create.humanities.uva.nl/';
export const MODELS_PER_PAGE = 6;
export const COLLECTIONS_PER_PAGE = 10;
export const MODEL_PREVIEW_QUALITY = 'Thumb';
export const MODEL_PREVIEW_UIMODE = 'none';
export const FUSE_SEARCH_CONFIG = {
  keys: ['filename'],
  minMatchCharLength: 3,
};
export const COLLECTIONS_FUSE_SEARCH_CONFIG = {
  keys: ['title', 'description'],
  minMatchCharLength: 3,
};
export const COLLECTION_PATH_ID_DIVIDER = '-$';
export const COLLECTION_PATH_ID_REGEX = /-\$([\d\w]+)/;
export const INPUT_DEBOUNCE_DELAY = 300; // ms
