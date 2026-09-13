import type { KnowledgeItem } from "./types";

export const catKnowledge: KnowledgeItem[] = [
  {
    id: "cat-energy-matched-preparation",
    domain: "cat",
    topic: "cat-strategy",
    subtopic: "energy-matching",
    claim: "Matching CAT preparation intensity to daily physiological energy prevents burnout and preserves consistency.",
    explanation: "High-level DILR sets and full mocks demand peak executive control. Attempting complex sets when exhausted leads to frustration and avoidance. Energy-tiered sessions preserve daily momentum.",
    evidenceLevel: "HIGH",
    evidenceType: "educational",
    population: "CAT Aspirants",
    relevantSignals: ["energy", "concentration", "focusedMinutes", "studyStress"],
    relatedTopics: ["cat-prep", "quant", "varc", "dilr"],
    usefulActions: [
      "LOW ENERGY (1-4/10): 5–10 minute task—solve 2 basic Quant arithmetic formulas or review 1 error log entry.",
      "NORMAL ENERGY (5-7/10): 20–45 minute focused session—solve 1 VARC RC passage or 1 DILR set.",
      "HIGH ENERGY (8-10/10): 60+ minute session—complete timed mock section, deep problem set, or thorough error analysis."
    ],
    caution: "Missing a day is an observation, not a failure. Never use missed study sessions as a reason to abandon your routine.",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "cat-error-log-analysis",
    domain: "cat",
    topic: "error-logs",
    subtopic: "metacognitive-review",
    claim: "Categorizing errors into Concept Gaps, Execution Errors, and Time Pressure yields faster score growth than simply solving more raw questions.",
    explanation: "Blind question volume without reflection reinforces bad heuristics. Classifying mistakes pinpoints whether to review foundational theory or refine question-selection strategy.",
    evidenceLevel: "HIGH",
    evidenceType: "educational",
    population: "CAT Aspirants",
    relevantSignals: ["concentration", "studyStress"],
    relatedTopics: ["cat-quant", "cat-dilr", "cat-varc"],
    usefulActions: [
      "Log every incorrect mock question with its error root cause: Conceptual, Calculation, or Selection.",
      "Re-solve logged error questions 5 days later without looking at solutions."
    ],
    caution: "Do not spend hours making pretty notes; prioritize active re-solving.",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    lastReviewed: "2026-09-01"
  }
];
