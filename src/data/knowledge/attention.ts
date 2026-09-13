import type { KnowledgeItem } from "./types";

export const attentionKnowledge: KnowledgeItem[] = [
  {
    id: "attentional-switching-residue",
    domain: "attention",
    topic: "task-switching",
    subtopic: "attention-residue",
    claim: "Frequent task switching leaves 'attention residue', diminishing cognitive capacity for the primary task.",
    explanation: "When switching from study to a quick phone notification, working memory remains partially engaged with the previous stimulus for several minutes, slowing task re-entry and increasing error rates.",
    evidenceLevel: "HIGH",
    evidenceType: "randomized-trial",
    population: "Students & Knowledge Workers",
    relevantSignals: ["concentration", "phoneUrges", "distractions", "focusedMinutes"],
    relatedTopics: ["task-switching", "monotasking", "phone-friction"],
    usefulActions: [
      "Keep phone in another room or out of arm's reach during deep focus sessions.",
      "Use distraction capture (writing distracting thoughts on paper instead of switching tabs)."
    ],
    caution: "Attentional focus naturally fluctuates; difficulty concentrating after hours of study indicates fatigue, not broken focus.",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "environment-friction-reduction",
    domain: "attention",
    topic: "environmental-design",
    subtopic: "friction-control",
    claim: "Reducing physical and digital friction before starting work increases task initiation speed more reliably than willpower.",
    explanation: "Willpower is a finite, vulnerable state heavily influenced by fatigue and hunger. Structuring your desk with open materials and closing distracting browser tabs bypasses initiation resistance.",
    evidenceLevel: "HIGH",
    evidenceType: "systematic-review",
    population: "Adults",
    relevantSignals: ["concentration", "escapeUrge", "focusBlocks"],
    relatedTopics: ["environment-reset", "task-initiation"],
    usefulActions: [
      "Prepare your study materials the night before.",
      "Use full-screen mode and site blockers for high-distraction web pages."
    ],
    caution: "A clean desk supports focus, but spending 2 hours reorganizing can become a form of productive procrastination.",
    sourceIds: ["PUBMED-PROCRASTINATION-2024"],
    lastReviewed: "2026-09-01"
  }
];
