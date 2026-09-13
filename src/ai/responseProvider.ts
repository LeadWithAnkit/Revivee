import type { KnowledgeItem } from "../data/knowledge";
import type { PersonalContext } from "./personalContext";
import type { StructuredIntervention } from "../data/interventions/interventions";
import type { IntentMode } from "./intentDetector";

export interface CompanionResponseContext {
  query: string;
  intent: IntentMode;
  context: PersonalContext;
  knowledgeItems: KnowledgeItem[];
  intervention: StructuredIntervention;
  patternStatement?: string;
}

export interface CompanionResponse {
  text: string;
  evidenceBadge?: { level: string; source: string };
  actionLabel?: string;
  actionType?: string;
  interventionId?: string;
  cautionNotice?: string;
}

export interface ResponseProvider {
  generate(inputCtx: CompanionResponseContext): Promise<CompanionResponse>;
}
