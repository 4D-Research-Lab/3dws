import { createContext, useState } from 'react';

const ModelsContext = createContext();

export function ModelsProvider({ children }) {
  const [contextModels, setContextModels] = useState([]);

  return (
    <ModelsContext.Provider value={{ contextModels, setContextModels }}>
      {children}
    </ModelsContext.Provider>
  );
}

export default ModelsContext;
