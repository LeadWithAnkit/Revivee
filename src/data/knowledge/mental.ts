import type { KnowledgeItem } from "./types";

export const mentalKnowledge: KnowledgeItem[] = [
  {
    id: "stress-arousal-regulation",
    domain: "stress",
    topic: "stress-response",
    subtopic: "autonomic-arousal",
    claim: "Acute stress is an adaptive physiological response to perceived challenge, but sustained unmanaged pressure creates task avoidance loops.",
    explanation: "Sympathetic activation increases heart rate and muscle readiness. When stress is perceived as threat rather than challenge, executive prefrontal cortex control dims, encouraging emotional escape (e.g. phone scrolling).",
    evidenceLevel: "HIGH",
    evidenceType: "systematic-review",
    population: "General Adults & Students",
    relevantSignals: ["studyStress", "escapeUrge", "phoneUrges", "concentration"],
    relatedTopics: ["stress", "task-avoidance", "emotional-regulation"],
    usefulActions: [
      "Use physiological sighing (2 quick inhales through nose, 1 slow exhale through mouth) for 60 seconds.",
      "Label the feeling specifically: 'I am experiencing task initiation pressure', reducing amygdala reactivity."
    ],
    caution: "Chronic overwhelming distress that interferes with daily living should be discussed with a qualified mental health clinician.",
    sourceIds: ["NIMH-STRESS-001", "WHO-SELFCARE-2026"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "emotional-granularity-alexithymia",
    domain: "mental",
    topic: "emotional-awareness",
    subtopic: "affect-labeling",
    claim: "Differentiating fine-grained emotions ('anxious', 'discouraged', 'fatigued') dampens limbic arousal more effectively than vague labels like 'bad' or 'stressed'.",
    explanation: "Affect labeling recruits prefrontal networks that modulate subcortical emotion processing. Alexithymia represents a continuum of emotional description difficulty, not a categorical mental illness.",
    evidenceLevel: "HIGH",
    evidenceType: "meta-analysis",
    population: "Adults",
    relevantSignals: ["emotionalEngagement", "enjoyment", "motivation"],
    relatedTopics: ["emotional-labeling", "alexithymia-framing"],
    usefulActions: [
      "Use an emotional vocabulary chart during daily check-ins to pick precise terms.",
      "Notice physical sensations (tight chest, heavy eyes) without judging them as failures."
    ],
    caution: "REVIVE does not diagnose alexithymia or psychological disorders. Self-tracking is for personal awareness.",
    sourceIds: ["NIMH-STRESS-001"],
    lastReviewed: "2026-09-01"
  }
];
