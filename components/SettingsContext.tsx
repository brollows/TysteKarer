import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the settings context
type SettingsContextType = {
  brorenMinBoolean: boolean;
  setBrorenMinBoolean: (value: boolean) => void;
  fuckYouBoolean: boolean;
  setFuckYouBoolean: (value: boolean) => void;
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Custom hook to use the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// SettingsProvider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brorenMinBoolean, setBrorenMinBoolean] = useState(false);
  const [fuckYouBoolean, setFuckYouBoolean] = useState(false);

  return (
    <SettingsContext.Provider value={{ brorenMinBoolean, setBrorenMinBoolean, fuckYouBoolean, setFuckYouBoolean }}>
      {children}
    </SettingsContext.Provider>
  );
};
