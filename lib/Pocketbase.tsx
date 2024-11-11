"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

const PocketBaseContext = createContext<PocketBase | null>(null);

export const usePocketBase = () => {
  return useContext(PocketBaseContext);
};

export const PocketBaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pb, setPb] = useState<PocketBase | null>(null);

  useEffect(() => {
    const pocketBase = new PocketBase('https://ngs-system.pockethost.io/');
    setPb(pocketBase);
  }, []);

  return (
    <PocketBaseContext.Provider value={pb}>
      {children}
    </PocketBaseContext.Provider>
  );
};
