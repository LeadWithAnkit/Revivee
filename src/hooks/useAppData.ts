import { useEffect, useState } from "react";
import { db, type Observation, type StudySession, type InterventionResult } from "../lib/db";
import { useAuth } from "../context";

export function useAppData() {
  const { currentUser } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [interventions, setInterventions] = useState<InterventionResult[]>([]);
  const [ready, setReady] = useState(false);

  async function refresh() {
    try {
      const [o, s, i] = await Promise.all([db.getObservations(), db.getSessions(), db.getInterventions()]);
      setObservations(o.sort((a, b) => b.date.localeCompare(a.date)));
      setSessions(s.sort((a, b) => b.date.localeCompare(a.date)));
      setInterventions(i.sort((a, b) => b.date.localeCompare(a.date)));
      setReady(true);
    } catch (err) {
      setReady(true);
    }
  }

  useEffect(() => {
    refresh();
  }, [currentUser]);

  return { observations, sessions, interventions, ready, refresh };
}
