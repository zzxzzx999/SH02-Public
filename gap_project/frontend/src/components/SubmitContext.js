import { createContext, useContext } from 'react';

const SubmitContext = createContext();

export const SubmitProvider = ({ submitAnswersToAPI, children }) => (
  <SubmitContext.Provider value={submitAnswersToAPI}>
    {children}
  </SubmitContext.Provider>
);

export const useSubmit = () => useContext(SubmitContext);
