import type { KnowledgeItem } from "./types";

export const habitKnowledge: KnowledgeItem[] = [
  {
    id: "procrastination-emotional-regulation",
    domain: "procrastination",
    topic: "task-avoidance",
    subtopic: "emotional-avoidance",
    claim: "Procrastination is primarily an emotional regulation challenge caused by task aversion or uncertainty—not laziness or poor character.",
    explanation: "When a task triggers feelings of uncertainty, perfectionism, or boredom, the brain prioritizes short-term emotional relief by steering attention toward immediate comfort (e.g., social media or cleaning).",
    evidenceLevel: "HIGH",
    evidenceType: "meta-analysis",
    population: "Students & Professionals",
    relevantSignals: ["escapeUrge", "studyStress", "concentration"],
    relatedTopics: ["task-shrinking", "implementation-intentions", "self-compassion"],
    usefulActions: [
      "Use 'Micro-Task Shrinking': reduce the target to solving 1 question or opening 1 file.",
      "Formulate an Implementation Intention: 'If I feel urge to check phone, THEN I will take 3 deep breaths and write down the distraction.'"
    ],
    caution: "Framing difficulty starting as 'laziness' increases guilt and prolongs avoidance.",
    sourceIds: ["PUBMED-PROCRASTINATION-2024"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "implementation-intentions-habits",
    domain: "habits",
    topic: "habit-formation",
    subtopic: "if-then-planning",
    claim: "Implementation intentions ('If Situation X occurs, Then I will perform Action Y') double the likelihood of action initiation.",
    explanation: "Pre-deciding the time, trigger, and place for an action automates cue detection, bypassing executive deliberation when energy or motivation is low.",
    evidenceLevel: "HIGH",
    evidenceType: "meta-analysis",
    population: "Adults",
    relevantSignals: ["focusBlocks", "focusedMinutes", "motivation"],
    relatedTopics: ["habit-formation", "cue-response"],
    usefulActions: [
      "Write down your exact start trigger: 'When I finish my morning tea at 9:00 AM, I will open my Quant notebook on page 12.'",
      "Keep starting triggers tiny and predictable."
    ],
    caution: "Do not create rigid 15-step routines that collapse under real-world stress.",
    sourceIds: ["PUBMED-PROCRASTINATION-2024", "WHO-SELFCARE-2026"],
    lastReviewed: "2026-09-01"
  }
];
