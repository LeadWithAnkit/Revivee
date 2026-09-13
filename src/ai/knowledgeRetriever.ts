import { allKnowledgeItems, type KnowledgeItem } from "../data/knowledge";
import type { IntentMode } from "./intentDetector";

export function retrieveKnowledge(query: string, intent: IntentMode, topics: string[]): KnowledgeItem[] {
  const q = query.toLowerCase();

  const scored = allKnowledgeItems.map(item => {
    let score = 0;

    // Intent match
    if (intent.toLowerCase() === item.domain.toLowerCase()) score += 10;

    // Topic & subtopic match
    if (topics.includes(item.domain)) score += 6;
    if (q.includes(item.topic.toLowerCase())) score += 5;
    if (q.includes(item.subtopic.toLowerCase())) score += 4;

    // Keyword matching across claim and explanation
    const keywords = q.split(/\s+/).filter(w => w.length > 3);
    keywords.forEach(kw => {
      if (item.claim.toLowerCase().includes(kw)) score += 3;
      if (item.explanation.toLowerCase().includes(kw)) score += 2;
    });

    // Evidence level weighting
    if (item.evidenceLevel === "HIGH") score += 2;

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return top 2-4 relevant items
  return scored.filter(s => s.score > 2).map(s => s.item).slice(0, 3);
}
