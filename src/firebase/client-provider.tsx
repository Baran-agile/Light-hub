// src/firebase/client-provider.tsx
'use client';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseClientContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseClientProvider({
  value,
  children,
}: {
  value: FirebaseContextValue;
  children: ReactNode;
}) {
  return (
    <FirebaseClientContext.Provider value={value}>
      {children}
    </FirebaseClientContext.Provider>
  );
}

export const useFirebaseClient = () => {
  const context = useContext(FirebaseClientContext);
  if (!context) {
    throw new Error('useFirebaseClient must be used within a FirebaseProvider.');
  }
  return context;
};
