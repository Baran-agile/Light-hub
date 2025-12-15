// src/firebase/firestore/use-collection.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, query, collection, where, orderBy, limit, type Query, type DocumentData, type CollectionReference } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type QueryConstraint = ReturnType<typeof where | typeof orderBy | typeof limit>;

export function useCollection<T extends DocumentData>(
  collectionPath: string,
  ...queryConstraints: QueryConstraint[]
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRef = useMemo(() => {
    const collRef: CollectionReference<T> = collection(firestore, collectionPath) as CollectionReference<T>;
    return query(collRef, ...queryConstraints);
  }, [firestore, collectionPath, queryConstraints]);


  useEffect(() => {
    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setIsLoading(false);
      },
      (err) => {
        console.error("onSnapshot error:", err);
        const permissionError = new FirestorePermissionError({
          path: (queryRef as Query).path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryRef]);

  return { data, isLoading, error };
}
