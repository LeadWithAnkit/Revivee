import type { KnowledgeItem } from "./types";

export const sleepKnowledge: KnowledgeItem[] = [
  {
    id: "sleep-duration-adults",
    domain: "sleep",
    topic: "sleep-duration",
    subtopic: "recommended-hours",
    claim: "Adults generally require 7 or more hours of quality sleep per night for optimal cognitive function and emotional regulation.",
    explanation: "Public health guidelines recommend 7–9 hours for adults. Cumulative sleep restriction below this threshold impairs working memory, sustained attention, and mood stability.",
    evidenceLevel: "HIGH",
    evidenceType: "guideline",
    population: "General Adult Population",
    relevantSignals: ["sleepHours", "daytimeSleepiness", "concentration", "energy"],
    relatedTopics: ["sleep-quality", "circadian-rhythm", "attention"],
    usefulActions: [
      "Track your sleep duration for 7 consecutive days alongside morning alertness.",
      "Protect a consistent 8-hour opportunity window in bed."
    ],
    caution: "One short night is an observation, not an immediate cause of severe panic or persistent cognitive decline.",
    sourceIds: ["CDC-SLEEP-001", "NICE-SLEEP-HYGIENE"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "sleep-consistency-circadian",
    domain: "sleep",
    topic: "sleep-consistency",
    subtopic: "circadian-rhythm",
    claim: "Consistent sleep-wake timing anchors the circadian pacemaker more effectively than varying bedtime lengths.",
    explanation: "Shifting sleep schedules by more than 90 minutes between weekdays and weekends disrupts peripheral biological clocks, producing daytime drowsiness even when total hours appear sufficient.",
    evidenceLevel: "HIGH",
    evidenceType: "meta-analysis",
    population: "Adults & Students",
    relevantSignals: ["sleepHours", "awakenings", "daytimeSleepiness"],
    relatedTopics: ["sleep-timing", "daytime-alertness"],
    usefulActions: [
      "Maintain a regular wake-up time within a 30-minute window every day.",
      "Get morning sunlight exposure within 60 minutes of waking."
    ],
    caution: "Individual chronotypes vary; forced early mornings without aligned bedtimes can cause sleep deficit.",
    sourceIds: ["NICE-SLEEP-HYGIENE", "CDC-SLEEP-001"],
    lastReviewed: "2026-09-01"
  },
  {
    id: "caffeine-sleep-latency",
    domain: "sleep",
    topic: "caffeine-impact",
    subtopic: "adenosine-blockade",
    claim: "Caffeine consumed within 6 hours of bedtime reduces deep slow-wave sleep architecture even if falling asleep feels easy.",
    explanation: "Caffeine antagonizes adenosine receptors in the central nervous system. Because its half-life ranges from 3 to 7 hours, evening caffeine suppresses delta-wave sleep intensity.",
    evidenceLevel: "HIGH",
    evidenceType: "randomized-trial",
    population: "Adults",
    relevantSignals: ["sleepQuality", "awakenings", "daytimeSleepiness"],
    relatedTopics: ["sleep-quality", "caffeine-timing"],
    usefulActions: [
      "Set a caffeine cutoff 8–10 hours before your planned bedtime.",
      "Swap late-afternoon coffee with herbal tea or water."
    ],
    caution: "Caffeine tolerance varies genetically; sensitivity changes with stress levels.",
    sourceIds: ["NICE-SLEEP-HYGIENE"],
    lastReviewed: "2026-09-01"
  }
];
