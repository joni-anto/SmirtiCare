/**
 * useStore.js
 * A React hook version of the old Store module. Same idea: write events to
 * Firestore (works offline automatically), and subscribe to a live list
 * for the Offline/Caregiver screen with real "synced" status per item.
 */
import { useEffect, useState, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";

const PATIENT_ID = "demo-patient"; // Phase 1: one fixed patient, real auth is a later phase

export function useStore() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const eventsRef = collection(db, "patients", PATIENT_ID, "events");
    const q = query(eventsRef, orderBy("ts", "desc"), limit(8));
    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
      setQueue(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          synced: !doc.metadata.hasPendingWrites
        }))
      );
    });
    return unsubscribe; // cleans up the listener if this component ever unmounts
  }, []);

  const addEvent = useCallback(async (type, payload) => {
    const eventsRef = collection(db, "patients", PATIENT_ID, "events");
    const record = { type, payload, ts: Date.now(), createdAt: serverTimestamp() };
    await addDoc(eventsRef, record);
    return record;
  }, []);

  return { queue, addEvent };
}
