import type { SourceRecord } from "../knowledge/types";

export const sourceRegistry: Record<string, SourceRecord> = {
  "WHO-SELFCARE-2026": {
    id: "WHO-SELFCARE-2026",
    organization: "World Health Organization",
    title: "WHO Consolidated Guideline on Self-Care Interventions for Health and Well-being",
    year: 2026,
    url: "https://www.who.int/publications/i/item/9789240052192",
    sourceType: "guideline",
    topics: ["self-care", "mental-health", "wellbeing"],
    reliability: "high"
  },
  "CDC-SLEEP-001": {
    id: "CDC-SLEEP-001",
    organization: "Centers for Disease Control and Prevention",
    title: "Sleep and Sleep Disorders: Basics and Duration Guidelines",
    year: 2024,
    url: "https://www.cdc.gov/sleep/about/index.html",
    sourceType: "agency-report",
    topics: ["sleep", "circadian-rhythm", "daytime-sleepiness"],
    reliability: "high"
  },
  "NIMH-STRESS-001": {
    id: "NIMH-STRESS-001",
    organization: "National Institute of Mental Health",
    title: "I'm So Stressed Out! Fact Sheet on Stress and Anxiety",
    year: 2025,
    url: "https://www.nimh.nih.gov/health/publications/stress",
    sourceType: "agency-report",
    topics: ["stress", "anxiety", "coping-strategies"],
    reliability: "high"
  },
  "NIDA-DOPAMINE-001": {
    id: "NIDA-DOPAMINE-001",
    organization: "National Institute on Drug Abuse",
    title: "Neurobiology of Reward, Motivation, and Reinforcement Learning",
    year: 2024,
    url: "https://nida.nih.gov/research-topics/neuroscience",
    sourceType: "journal",
    topics: ["dopamine", "reward-prediction-error", "habits"],
    reliability: "high"
  },
  "NIH-ODS-HYDRATION": {
    id: "NIH-ODS-HYDRATION",
    organization: "NIH Office of Dietary Supplements & National Academies",
    title: "Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate",
    year: 2024,
    url: "https://ods.od.nih.gov/",
    sourceType: "guideline",
    topics: ["hydration", "fluid-intake", "thirst"],
    reliability: "high"
  },
  "NICE-SLEEP-HYGIENE": {
    id: "NICE-SLEEP-HYGIENE",
    organization: "National Institute for Health and Care Excellence",
    title: "Insomnia & Sleep Disturbance Management in Adults",
    year: 2025,
    url: "https://www.nice.org.uk/guidance/cks/sleep-disorders",
    sourceType: "guideline",
    topics: ["sleep", "sleep-hygiene", "circadian-rhythm"],
    reliability: "high"
  },
  "NHS-NUTRITION-GUIDE": {
    id: "NHS-NUTRITION-GUIDE",
    organization: "NHS England",
    title: "The Eatwell Guide: Balanced Diet, Energy & Hydration",
    year: 2025,
    url: "https://www.nhs.uk/live-well/eat-well/",
    sourceType: "guideline",
    topics: ["nutrition", "dietary-diversity", "energy"],
    reliability: "high"
  },
  "PUBMED-RETRIEVAL-2023": {
    id: "PUBMED-RETRIEVAL-2023",
    organization: "Journal of Educational Psychology & PubMed",
    title: "Rethinking Testing: Retrieval Practice Enhances Long-Term Memory and Metacognitive Calibration",
    year: 2023,
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    sourceType: "meta-analysis",
    topics: ["study-science", "retrieval-practice", "spacing"],
    reliability: "high"
  },
  "PUBMED-PROCRASTINATION-2024": {
    id: "PUBMED-PROCRASTINATION-2024",
    organization: "Psychological Bulletin & PubMed",
    title: "The Nature of Procrastination: Emotional Regulation, Task Aversion, and Implementation Intentions",
    year: 2024,
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    sourceType: "meta-analysis",
    topics: ["procrastination", "emotional-regulation", "task-initiation"],
    reliability: "high"
  },
  "COCHRANE-EXERCISE-MOOD": {
    id: "COCHRANE-EXERCISE-MOOD",
    organization: "Cochrane Database of Systematic Reviews",
    title: "Physical Activity and Brief Movement for Non-Clinical Mood Elevation",
    year: 2024,
    url: "https://www.cochranelibrary.com/",
    sourceType: "meta-analysis",
    topics: ["movement", "mood", "energy"],
    reliability: "high"
  }
};
