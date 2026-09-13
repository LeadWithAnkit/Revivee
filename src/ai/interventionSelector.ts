import { interventionDatabase, type StructuredIntervention } from "../data/interventions/interventions";
import type { PersonalContext } from "./personalContext";
import type { IntentMode } from "./intentDetector";

export interface SelectedInterventionPair {
  primary: StructuredIntervention;
  backup?: StructuredIntervention;
}

export function selectInterventions(
  intent: IntentMode,
  context: PersonalContext
): SelectedInterventionPair {
  const energy = context.todayObs?.energy ?? 5;
  const focus = context.todayObs?.concentration ?? 5;

  // Filter candidate interventions based on intent & energy state
  let candidates = [...interventionDatabase];

  if (intent === "RESET" || intent === "DISTRACTION" || focus <= 4) {
    candidates = candidates.filter(i => i.suitableWhen.includes("cannot-start") || i.suitableWhen.includes("procrastination") || i.suitableWhen.includes("distracted"));
  } else if (intent === "STUDY" || intent === "CAT") {
    candidates = candidates.filter(i => i.category === "study-strategy" || i.category === "task-initiation" || i.category === "focus");
  } else if (intent === "MIND" || intent === "SLEEP") {
    candidates = candidates.filter(i => i.category === "mindfulness" || i.category === "environment");
  }

  if (candidates.length === 0) {
    candidates = [...interventionDatabase];
  }

  // Prioritize interventions that received positive feedback in pastInterventions
  const scored = candidates.map(item => {
    let score = 1;
    const history = context.pastInterventions.filter(p => p.intervention === item.name || p.id === item.id);
    if (history.length > 0) {
      const avgHelp = history.reduce((a, b) => a + (b.helpfulness || 0), 0) / history.length;
      score += avgHelp * 2;
    }

    if (energy <= 4 && item.difficulty === "easy") score += 3;
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    primary: scored[0]?.item || interventionDatabase[0],
    backup: scored[1]?.item || interventionDatabase[1]
  };
}
