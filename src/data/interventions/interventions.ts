import type { EvidenceLevel } from "../knowledge/types";

export interface StructuredIntervention {
  id: string;
  name: string;
  category: "task-initiation" | "focus" | "mindfulness" | "environment" | "study-strategy" | "sleep" | "emotional";
  suitableWhen: string[];
  durationMinutes: number;
  difficulty: "easy" | "medium" | "adaptive";
  steps: string[];
  rationale: string;
  evidenceLevel: EvidenceLevel;
  sourceIds: string[];
  actionLabel: string;
  actionType?: "start-5m" | "breath-hold" | "memory-sprint" | "capture-distraction" | "open-reset" | "log-tracker";
}

export const interventionDatabase: StructuredIntervention[] = [
  {
    id: "int-task-shrink-5m",
    name: "5-Minute Task Shrinking",
    category: "task-initiation",
    suitableWhen: ["cannot-start", "procrastination", "overwhelm", "low-energy"],
    durationMinutes: 5,
    difficulty: "easy",
    steps: [
      "Define the absolute smallest visible output (e.g., solve 1 formula, open file).",
      "Set a timer for 5 minutes.",
      "Work without expecting perfection until the timer sounds."
    ],
    rationale: "Bypasses task initiation friction and emotional avoidance by reducing activation energy.",
    evidenceLevel: "HIGH",
    sourceIds: ["PUBMED-PROCRASTINATION-2024"],
    actionLabel: "Start 5-Minute Timer",
    actionType: "start-5m"
  },
  {
    id: "int-distraction-capture",
    name: "Distraction Capture Pad",
    category: "focus",
    suitableWhen: ["distracted", "phone-urges", "task-switching"],
    durationMinutes: 2,
    difficulty: "easy",
    steps: [
      "Keep a paper pad or digital capture note open.",
      "When an urge to check phone or switch tabs arises, write the thought down.",
      "Immediately return focus to the primary task."
    ],
    rationale: "Prevents attention residue while honoring the brain's impulse without acting on it.",
    evidenceLevel: "HIGH",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    actionLabel: "Capture Distraction",
    actionType: "capture-distraction"
  },
  {
    id: "int-breath-hold-attention",
    name: "Single-Point Breath Hold",
    category: "mindfulness",
    suitableWhen: ["stress", "anxiety", "overwhelm", "restless"],
    durationMinutes: 3,
    difficulty: "easy",
    steps: [
      "Focus vision on a single steady point or rhythmic pulse.",
      "Take 2 quick inhales through nose, followed by 1 slow extended exhale.",
      "Repeat 4 cycles to lower autonomic heart rate."
    ],
    rationale: "Activates parasympathetic vagal brake, reducing pre-task anxiety and limbic hyper-arousal.",
    evidenceLevel: "HIGH",
    sourceIds: ["NIMH-STRESS-001"],
    actionLabel: "Start Breath Exercise",
    actionType: "breath-hold"
  },
  {
    id: "int-memory-sprint-reset",
    name: "5-Digit Working Memory Sprint",
    category: "focus",
    suitableWhen: ["brain-fog", "sluggish", "distracted"],
    durationMinutes: 2,
    difficulty: "medium",
    steps: [
      "Generate a random 5-digit number sequence.",
      "Memorize the digits for 5 seconds.",
      "Enter the digits from memory as fast as possible."
    ],
    rationale: "Recruits prefrontal working memory networks, clearing mental fog before study re-entry.",
    evidenceLevel: "MODERATE",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    actionLabel: "Start Memory Sprint",
    actionType: "memory-sprint"
  },
  {
    id: "int-active-recall-check",
    name: "1-Page Active Recall Sprint",
    category: "study-strategy",
    suitableWhen: ["study-re-entry", "revision", "cat-prep"],
    durationMinutes: 10,
    difficulty: "medium",
    steps: [
      "Close all study notes and textbook pages.",
      "Write down or speak aloud every concept or formula remembered from your recent topic.",
      "Reopen notes only to check and correct missing gaps."
    ],
    rationale: "Forces retrieval practice, solidifying long-term memory traces far more effectively than rereading.",
    evidenceLevel: "HIGH",
    sourceIds: ["PUBMED-RETRIEVAL-2023"],
    actionLabel: "Try Active Recall",
    actionType: "start-5m"
  },
  {
    id: "int-environment-reset",
    name: "2-Minute Desk & Tab Reset",
    category: "environment",
    suitableWhen: ["cluttered-space", "tab-overload", "high-friction"],
    durationMinutes: 2,
    difficulty: "easy",
    steps: [
      "Close all browser tabs except your main study page.",
      "Move your mobile phone into another room or out of line-of-sight.",
      "Clear non-essential items from your desk surface."
    ],
    rationale: "Eliminates visual environment triggers that compete for working memory capacity.",
    evidenceLevel: "HIGH",
    sourceIds: ["PUBMED-PROCRASTINATION-2024"],
    actionLabel: "Open Reset Tools",
    actionType: "open-reset"
  }
];
