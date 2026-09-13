import type { KnowledgeItem } from "./types";

export const studyKnowledge: KnowledgeItem[] = [
  {
    id: "retrieval-practice-testing",
    domain: "study",
    topic: "retrieval-practice",
    subtopic: "active-recall",
    claim: "Actively recalling information from memory builds robust neural pathways significantly more effectively than passive rereading or highlighting.",
    explanation: "The act of retrieval forces the brain to reconstruct memory traces, strengthening synaptic connections and revealing hidden knowledge gaps (metacognitive calibration).",
    evidenceLevel: "HIGH",
    evidenceType: "meta-analysis",
    population: "Students & Adult Learners",
    relevantSignals: ["focusedMinutes", "concentration", "studyStress"],
    relatedTopics: ["retrieval-practice", "active-recall", "metacognition"],
    usefulActions: [
      "After reading a section, close the book and write down or explain out loud everything you remember.",
      "Use practice questions and flashcards before reviewing notes."
    ],
    caution: "Retrieval practice feels harder and less fluent than passive reading, but that 'desirable difficulty' is what produces retention.",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "distributed-practice-spacing",
    domain: "study",
    topic: "spacing-effect",
    subtopic: "distributed-learning",
    claim: "Spacing study sessions across multiple days yields higher long-term retention than cramming the same total hours into one day.",
    explanation: "Distributed retrieval forces memory consolidation during sleep intervals. Cramming creates short-term familiarity that decays rapidly within 48 hours.",
    evidenceLevel: "HIGH",
    evidenceType: "meta-analysis",
    population: "Students",
    relevantSignals: ["focusedMinutes", "focusBlocks", "concentration"],
    relatedTopics: ["spacing-effect", "retention"],
    usefulActions: [
      "Review new concepts 1 day, 3 days, and 7 days after initial learning.",
      "Keep daily study sessions shorter and more consistent rather than marathon 8-hour blocks."
    ],
    caution: "All-nighters damage memory consolidation and increase error rates on exam day.",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    lastReviewed: "2026-09-01"
  }
];
