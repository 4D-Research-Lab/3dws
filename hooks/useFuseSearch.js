import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function useFuseSearch(data, options) {
  const [fuse, setFuse] = useState(new Fuse(data, options));

  useEffect(() => {
    setFuse(new Fuse(data, options));
  }, [data, options]);
  return fuse;
}
