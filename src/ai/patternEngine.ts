import type { PersonalContext } from "./personalContext";

export interface PatternInsight {
  confidenceLabel: "Not enough data yet" | "Early pattern" | "Emerging pattern" | "More stable personal pattern";
  observationCount: number;
  statement: string;
  relationship: "sleep-focus" | "movement-mood" | "study-focus" | "general";
}

export function detectPatterns(context: PersonalContext): PatternInsight | null {
  const count = context.recentObs.length;
  if (count === 0) return null;

  let confidenceLabel: PatternInsight["confidenceLabel"] = "Not enough data yet";
  if (count >= 30) {
    confidenceLabel = "More stable personal pattern";
  } else if (count >= 14) {
    confidenceLabel = "Emerging pattern";
  } else if (count >= 7) {
    confidenceLabel = "Early pattern";
  } else {
    confidenceLabel = "Not enough data yet";
  }

  if (count < 3) {
    return {
      confidenceLabel: "Not enough data yet",
      observationCount: count,
      statement: `You have ${count} recorded entry. Keep logging daily check-ins to spot patterns across sleep, energy, and focus.`,
      relationship: "general"
    };
  }

  // Analyze Sleep ↔ Focus correlation across recorded entries
  const sleepFocusObs = context.recentObs.filter(o => o.sleepHours > 0 && o.concentration > 0);
  if (sleepFocusObs.length >= 3) {
    const highSleepDays = sleepFocusObs.filter(o => o.sleepHours >= 7);
    const lowSleepDays = sleepFocusObs.filter(o => o.sleepHours < 7);

    const highSleepAvgFocus = highSleepDays.length > 0
      ? highSleepDays.reduce((a, b) => a + b.concentration, 0) / highSleepDays.length
      : 0;
    const lowSleepAvgFocus = lowSleepDays.length > 0
      ? lowSleepDays.reduce((a, b) => a + b.concentration, 0) / lowSleepDays.length
      : 0;

    if (highSleepDays.length > 0 && lowSleepDays.length > 0 && highSleepAvgFocus > lowSleepAvgFocus) {
      return {
        confidenceLabel,
        observationCount: sleepFocusObs.length,
        statement: `Your entries show that days with 7+ hours sleep had higher focus (${highSleepAvgFocus.toFixed(1)}/10) compared to lower sleep days (${lowSleepAvgFocus.toFixed(1)}/10). This is an observational pattern, not proof of single causality.`,
        relationship: "sleep-focus"
      };
    }
  }

  return {
    confidenceLabel,
    observationCount: count,
    statement: `Across your ${count} recorded check-ins, your average sleep is ${context.avgSleep7d || "N/A"}h and concentration is ${context.avgFocus7d || "N/A"}/10. Keep logging to reveal further relationships.`,
    relationship: "general"
  };
}
