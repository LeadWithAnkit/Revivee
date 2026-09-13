import type { KnowledgeItem } from "./types";

export const dopamineKnowledge: KnowledgeItem[] = [
  {
    id: "dopamine-reward-prediction-error",
    domain: "dopamine",
    topic: "reward-signalling",
    subtopic: "reward-prediction-error",
    claim: "Dopamine is primarily a neurotransmitter of anticipation, motivation, and reward prediction error—not a raw pleasure chemical.",
    explanation: "Dopaminergic neurons fire when an unexpected reward occurs or when cues predict reward arrival. It drives goal-directed pursuit and cue-response reinforcement learning rather than reflecting satisfaction.",
    evidenceLevel: "HIGH",
    evidenceType: "systematic-review",
    population: "General Neuroscience",
    relevantSignals: ["motivation", "phoneUrges", "escapeUrge"],
    relatedTopics: ["reinforcement-learning", "habit-loops", "motivation"],
    usefulActions: [
      "Break long study goals into small micro-milestones to provide clear progress feedback.",
      "Recognize phone notifications as variable reward cues that trigger anticipatory checking."
    ],
    caution: "Internet health claims that oversimplify dopamine into 'depleted brain fluid' or recommend 'dopamine detoxes' are scientifically unsupported myths.",
    sourceIds: ["NIDA-DOPAMINE-001"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "dopamine-myths-debunked",
    domain: "dopamine",
    topic: "internet-myths",
    subtopic: "scientific-clarification",
    claim: "Social media and high-stimulation activities do not 'deplete' or 'destroy' your brain's dopamine supply.",
    explanation: "Dopamine synthesis and vesicular release are continuously regulated metabolic processes. Procrastination or screen checking reflects competing incentive salience and environment design—not damaged dopamine hardware.",
    evidenceLevel: "HIGH",
    evidenceType: "expert-consensus",
    population: "General Public",
    relevantSignals: ["phoneUrges", "motivation", "escapeUrge"],
    relatedTopics: ["digital-habits", "dopamine-myths"],
    usefulActions: [
      "Address task initiation friction by shrinking task scope rather than attempting extreme digital deprivation.",
      "Understand screen checking as habitual stimulus-response learning."
    ],
    caution: "Dopamine concepts must never be used to self-diagnose psychiatric disorders or assign shame to rest.",
    sourceIds: ["NIDA-DOPAMINE-001", "PUBMED-PROCRASTINATION-2024"],
    lastReviewed: "2026-09-01"
  }
];
