import type { KnowledgeItem } from "./types";
import { sleepKnowledge } from "./sleep";
import { nutritionKnowledge } from "./nutrition";
import { healthKnowledge } from "./health";
import { mentalKnowledge } from "./mental";
import { attentionKnowledge } from "./attention";
import { dopamineKnowledge } from "./dopamine";
import { habitKnowledge } from "./habits";
import { studyKnowledge } from "./study";
import { catKnowledge } from "./cat";

export * from "./types";

export const allKnowledgeItems: KnowledgeItem[] = [
  ...sleepKnowledge,
  ...nutritionKnowledge,
  ...healthKnowledge,
  ...mentalKnowledge,
  ...attentionKnowledge,
  ...dopamineKnowledge,
  ...habitKnowledge,
  ...studyKnowledge,
  ...catKnowledge
];
