import React, { useState } from 'react';

export type Balances = {
    DragonTears: number;
    DragonStone: number;
    Core: number;
}

type CountdownContextType = {
    countdownEnds: number;
    incrementCountdownEnds: () => void;
    resetCountdownEnds: () => void;
    updateBalances: (balances: Balances) => void;
    balances: Balances;
    nftBalances: any;
    updateNftBalances: (nftBalances: any) => void;
  };

export const CountdownContext = React.createContext<CountdownContextType>({
  countdownEnds: 0,
  incrementCountdownEnds: () => {},
  resetCountdownEnds: () => {},
  updateBalances: () => {}, 
  balances: { Mineral: 0, Fragment: 0, Core: 0 },
});


export function CountdownProvider({ children }) {
  const [countdownEnds, setCountdownEnds] = useState(0);
  const [balances, setBalances] = useState({DragonTears:0});
  const [nftBalances, setNftBalances] = useState({});

  const incrementCountdownEnds = () => {
    setCountdownEnds(prevCountdownEnds => prevCountdownEnds + 100);
  };

  const resetCountdownEnds = () => {
    setCountdownEnds(0);
  }

  const updateBalances = (newBalances:Balances) => {
    setBalances({ ...balances, ...newBalances });
  }

  const updateNftBalances = (newNftBalances:Balances) => {
    setNftBalances({ ...nftBalances, ...newNftBalances });
  }

  return (
    <CountdownContext.Provider value={{ countdownEnds, incrementCountdownEnds, resetCountdownEnds, balances, updateBalances, nftBalances, updateNftBalances }}>
      {children}
    </CountdownContext.Provider>
  );
}