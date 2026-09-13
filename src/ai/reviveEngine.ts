import { checkSafety } from "./safetyEngine";
import { detectIntent } from "./intentDetector";
import { extractTopics } from "./topicExtractor";
import { filterPersonalContext } from "./personalContext";
import { detectPatterns } from "./patternEngine";
import { retrieveKnowledge } from "./knowledgeRetriever";
import { selectInterventions } from "./interventionSelector";
import { buildCompanionResponse } from "./responseBuilder";
import type { CompanionResponse } from "./responseProvider";
import type { Observation, StudySession, InterventionResult } from "../lib/db";

export async function processCompanionQuery(
  input: string,
  obs: Observation[],
  sessions: StudySession[],
  interventions: InterventionResult[]
): Promise<CompanionResponse> {
  const query = input.trim();
  if (!query) {
    return {
      text: "What do you need right now? Try asking 'What should I do today?' or 'I can't study'.",
      evidenceBadge: { level: "HIGH", source: "REVIVE Guide" }
    };
  }

  // Step 1: Safety Check
  const safety = checkSafety(query);
  if (safety.isEmergency) {
    return {
      text: safety.message || "Please seek immediate care.",
      evidenceBadge: { level: "HIGH", source: "Emergency & Safety Protocol" },
      cautionNotice: "REVIVE safety system triggered. Please prioritize your wellbeing and safety."
    };
  }

  // Step 2: Intent & Topic Extraction
  const intent = detectIntent(query);
  const topics = extractTopics(query);

  // Step 3: Personal Context Filtering
  const personalContext = filterPersonalContext(obs, sessions, interventions, topics);

  // Step 4: Non-Causal Pattern Engine
  const patternInsight = detectPatterns(personalContext);

  // Step 5: Structured Knowledge Retrieval
  const knowledgeItems = retrieveKnowledge(query, intent, topics);

  // Step 6: Structured Intervention Selection
  const selectedInterventions = selectInterventions(intent, personalContext);

  // Step 7: Response Building
  const response = buildCompanionResponse({
    query,
    intent,
    context: personalContext,
    knowledgeItems,
    intervention: selectedInterventions.primary,
    patternStatement: patternInsight?.statement
  });

  return response;
}
