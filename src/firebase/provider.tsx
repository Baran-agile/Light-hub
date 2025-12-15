// src/firebase/provider.tsx
'use client';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { FirebaseClientProvider } from './client-provider';

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const apps = getApps();
      const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
        const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
        // Check if the emulator is already connected to avoid errors
        if (!(auth as any).emulatorConfig) {
          connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
        }
        if (!(firestore as any).emulatorConfig) {
          connectFirestoreEmulator(firestore, host, 8080);
        }
      }

      setApp(app);
      setAuth(auth);
      setFirestore(firestore);
    }
  }, []);

  const value = useMemo(() => {
    if (app && auth && firestore) {
      return { app, auth, firestore };
    }
    return null;
  }, [app, auth, firestore]);

  if (!value) {
    // You can render a loading indicator here
    return null; 
  }

  return (
    <FirebaseContext.Provider value={value}>
      <FirebaseClientProvider value={value}>{children}</FirebaseClientProvider>
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
