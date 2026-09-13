import type { KnowledgeItem } from "./types";

export const healthKnowledge: KnowledgeItem[] = [
  {
    id: "physical-fatigue-multi-factorial",
    domain: "health",
    topic: "physical-fatigue",
    subtopic: "symptom-observation",
    claim: "Physical fatigue is non-specific and usually reflects an accumulation of sleep debt, psychological stress, sedentary strain, or physical exertion.",
    explanation: "Fatigue is a multi-dimensional biological signal. Rather than jumping to disease assumptions, tracking fatigue alongside daily sleep, movement, hydration, and workload provides clear self-observation data.",
    evidenceLevel: "HIGH",
    evidenceType: "guideline",
    population: "Adults",
    relevantSignals: ["energy", "sleepHours", "studyStress", "muscleAches"],
    relatedTopics: ["fatigue", "recovery"],
    usefulActions: [
      "Track energy ratings over 5–7 days alongside sleep duration and study hours.",
      "Incorporate 10 minutes of gentle physical movement or outdoor walking."
    ],
    caution: "Unexplained, severe, or worsening physical exhaustion lasting several weeks requires clinical medical evaluation.",
    sourceIds: ["WHO-SELFCARE-2026", "NIMH-STRESS-001"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "sedentary-behaviour-energy",
    domain: "health",
    topic: "physical-activity",
    subtopic: "sedentary-breakout",
    claim: "Prolonged unbroken sitting decreases cerebral oxygenation and increases subjective mental tiredness.",
    explanation: "Static postures reduce muscle pump activation and venous return. Periodic 2-minute movement breaks restore alertness and executive control during study sessions.",
    evidenceLevel: "HIGH",
    evidenceType: "meta-analysis",
    population: "Students & Desk Workers",
    relevantSignals: ["energy", "concentration", "focusedMinutes"],
    relatedTopics: ["movement-breaks", "focus-restoration"],
    usefulActions: [
      "Stand up and stretch every 45–60 minutes.",
      "Perform 60 seconds of gentle joint mobility or pacing between focus blocks."
    ],
    caution: "Movement breaks should be light and restorative rather than exhausting workouts during high-stress study days.",
    sourceIds: ["COCHRANE-EXERCISE-MOOD", "WHO-SELFCARE-2026"],
    lastReviewed: "2026-09-01"
  }
];
