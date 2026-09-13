import type { Observation, StudySession, InterventionResult } from "../lib/db";

export interface PersonalContext {
  todayObs?: Observation;
  recentObs: Observation[];
  recentSessions: StudySession[];
  pastInterventions: InterventionResult[];
  avgSleep7d?: number;
  avgFocus7d?: number;
  avgEnergy7d?: number;
  totalStudyToday: number;
}

export function filterPersonalContext(
  obs: Observation[],
  sessions: StudySession[],
  interventions: InterventionResult[],
  intentTopics: string[]
): PersonalContext {
  const todayStr = new Date().toISOString().slice(0, 10);
  const sortedObs = [...obs].sort((a, b) => b.date.localeCompare(a.date));
  const todayObs = sortedObs.find(o => o.date === todayStr) || sortedObs[0];

  const recentObs = sortedObs.slice(0, 7);
  const recentSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
  const todaySessions = sessions.filter(s => s.date === todayStr || (todayObs && s.date === todayObs.date));

  const totalStudyToday = todaySessions.reduce((acc, s) => acc + s.minutes, 0) || (todayObs?.focusedMinutes || 0);

  const validSleep = recentObs.filter(o => o.sleepHours > 0);
  const avgSleep7d = validSleep.length > 0 
    ? Number((validSleep.reduce((a, b) => a + b.sleepHours, 0) / validSleep.length).toFixed(1))
    : undefined;

  const validFocus = recentObs.filter(o => o.concentration > 0);
  const avgFocus7d = validFocus.length > 0 
    ? Number((validFocus.reduce((a, b) => a + b.concentration, 0) / validFocus.length).toFixed(1))
    : undefined;

  const validEnergy = recentObs.filter(o => o.energy > 0);
  const avgEnergy7d = validEnergy.length > 0 
    ? Number((validEnergy.reduce((a, b) => a + b.energy, 0) / validEnergy.length).toFixed(1))
    : undefined;

  return {
    todayObs,
    recentObs,
    recentSessions,
    pastInterventions: interventions || [],
    avgSleep7d,
    avgFocus7d,
    avgEnergy7d,
    totalStudyToday
  };
}
