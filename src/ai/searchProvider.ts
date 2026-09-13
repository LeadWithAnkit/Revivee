import { allKnowledgeItems, type KnowledgeItem } from "../data/knowledge";

export interface SearchResult {
  id: string;
  title: string;
  explanation: string;
  evidenceLevel: string;
  sourceOrganization: string;
  url?: string;
  domain: string;
}

export interface SearchProvider {
  search(query: string): Promise<SearchResult[]>;
}

export class LocalSearchProvider implements SearchProvider {
  async search(query: string): Promise<SearchResult[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const matches = allKnowledgeItems.filter(item => 
      item.claim.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      item.domain.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q)
    );

    return matches.map(m => ({
      id: m.id,
      title: m.claim,
      explanation: m.explanation,
      evidenceLevel: m.evidenceLevel,
      sourceOrganization: m.sourceIds[0] || "REVIVE Knowledge Base",
      domain: m.domain
    }));
  }
}

// External Search Adapter placeholder for server proxy integration
export class ExternalSearchProviderAdapter implements SearchProvider {
  private local = new LocalSearchProvider();

  async search(query: string): Promise<SearchResult[]> {
    // Falls back safely to LocalSearchProvider without client-side API key exposure
    return this.local.search(query);
  }
}
