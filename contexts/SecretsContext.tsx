// @/contexts/SecretsContext.tsx

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface SecretsData {
  domain: string;
  appId: string;
  secret: string;
}

type SecretsAction = {
  type: 'SET_SECRETS';
  payload: SecretsData;
};

const loadInitialState = (): SecretsData => {
  if (typeof window === 'undefined') {
    return {
      domain: '',
      appId: '',
      secret: '',
    };
  }

  const savedData = localStorage.getItem('secrets');
  return savedData ? JSON.parse(savedData) : {
    domain: '',
    appId: '',
    secret: '',
  };
}

const initialState = loadInitialState();

const SecretsContext = createContext<{ state: SecretsData; dispatch: React.Dispatch<SecretsAction> } | undefined>(undefined);

const secretsReducer = (state: SecretsData, action: SecretsAction): SecretsData => {
  switch (action.type) {
    case 'SET_SECRETS':
      return action.payload;
    default:
      return state;
  }
};

export const SecretsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(secretsReducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('secrets', JSON.stringify(state));
    }
  }, [state]);

  return <SecretsContext.Provider value={{ state, dispatch }}>{children}</SecretsContext.Provider>;
};

export const useSecrets = () => {
  const context = useContext(SecretsContext);
  if (!context) {
    throw new Error('useSecrets must be used within a SecretsProvider');
  }
  return context;
};
