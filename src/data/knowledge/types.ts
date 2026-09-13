// Structured Knowledge Item & Source Schema for REVIVE Companion

export type EvidenceLevel = "HIGH" | "MODERATE" | "LIMITED" | "PRELIMINARY" | "UNKNOWN";

export type EvidenceType = 
  | "guideline"
  | "systematic-review"
  | "meta-analysis"
  | "randomized-trial"
  | "observational"
  | "mechanistic"
  | "expert-consensus"
  | "educational";

export type DomainType = 
  | "sleep"
  | "nutrition"
  | "hydration"
  | "health"
  | "mental"
  | "attention"
  | "dopamine"
  | "habits"
  | "procrastination"
  | "stress"
  | "wellbeing"
  | "study"
  | "cat";

export interface SourceRecord {
  id: string;
  organization: string;
  title: string;
  year: number;
  url: string;
  sourceType: "guideline" | "journal" | "agency-report" | "meta-analysis" | "book";
  topics: string[];
  reliability: "high" | "moderate";
}

export interface KnowledgeItem {
  id: string;
  domain: DomainType;
  topic: string;
  subtopic: string;
  claim: string;
  explanation: string;
  evidenceLevel: EvidenceLevel;
  evidenceType: EvidenceType;
  population?: string;
  relevantSignals: string[];
  relatedTopics: string[];
  usefulActions: string[];
  caution?: string;
  sourceIds: string[];
  lastReviewed: string;
  evidenceConflict?: boolean;
}
