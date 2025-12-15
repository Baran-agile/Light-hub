// src/firebase/index.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // On the server, we need to create a new instance for each request.
    const apps = getApps();
    app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  } else {
    // On the client, we can use a singleton instance.
    if (!app) {
      const apps = getApps();
      app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    }
  }
  auth = getAuth(app);
  firestore = getFirestore(app);

  return { app, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
