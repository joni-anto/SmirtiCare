import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

const PATIENT_ID = "demo-patient"; // Phase 1: one fixed patient, real linking is a later phase

export function useReminders() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const ref = collection(db, "patients", PATIENT_ID, "reminders");
    const q = query(ref, orderBy("scheduledTime", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReminders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  const addReminder = useCallback(async (data) => {
    const ref = collection(db, "patients", PATIENT_ID, "reminders");
    await addDoc(ref, {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      completedAt: null
    });
  }, []);

  const markDone = useCallback(async (reminderId) => {
    const ref = doc(db, "patients", PATIENT_ID, "reminders", reminderId);
    await updateDoc(ref, { status: 'completed', completedAt: serverTimestamp() });
  }, []);

  // Phase 1 keeps this simple: logs the snooze rather than actually
  // rescheduling scheduledTime — good enough to demo the interaction,
  // real rescheduling logic is a later-phase refinement.
  const snooze = useCallback(async (reminderId, minutes) => {
    const ref = doc(db, "patients", PATIENT_ID, "reminders", reminderId);
    await updateDoc(ref, { status: 'snoozed', snoozedMinutes: minutes });
  }, []);

  const nextReminder = reminders.find(r => r.status === 'pending' || r.status === 'snoozed') || null;

  return { reminders, addReminder, markDone, snooze, nextReminder };
}
