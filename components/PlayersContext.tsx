import React, { createContext, useContext, useState, ReactNode } from 'react';

type PlayerContextType = {
  players: string[];
  addPlayer: (player: string) => void;
};

const PlayersContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayers = (): PlayerContextType => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

export const PlayersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<string[]>([]);

  const addPlayer = (player: string) => setPlayers((prevPlayers) => [...prevPlayers, player]);

  return (
    <PlayersContext.Provider value={{ players, addPlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};
