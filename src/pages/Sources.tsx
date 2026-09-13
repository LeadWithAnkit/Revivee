import { useState } from "react";
import { Search, ShieldAlert, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";
import { Card, EvidenceBadge, SectionTitle } from "../components/ui";
import { allKnowledgeItems, type DomainType } from "../data/knowledge";
import { sourceRegistry } from "../data/sources/sources";

export default function Sources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const domains: { id: string; label: string }[] = [
    { id: "all", label: "All Domains" },
    { id: "sleep", label: "Sleep" },
    { id: "nutrition", label: "Nutrition & Hydration" },
    { id: "health", label: "Physical Health" },
    { id: "mental", label: "Mental Health & Stress" },
    { id: "attention", label: "Attention & Focus" },
    { id: "dopamine", label: "Dopamine & Reward Science" },
    { id: "habits", label: "Habits & Procrastination" },
    { id: "study", label: "Study Science" },
    { id: "cat", label: "CAT Preparation" }
  ];

  const filteredKnowledge = allKnowledgeItems.filter(item => {
    const matchesDomain = selectedDomain === "all" || item.domain === selectedDomain;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.claim.toLowerCase().includes(q) || 
      item.explanation.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q) ||
      item.subtopic.toLowerCase().includes(q);
    return matchesDomain && matchesSearch;
  });

  const sourcesList = Object.values(sourceRegistry);

  return (
    <div className="page">
      <SectionTitle
        eyebrow="Research & Knowledge Base"
        title="Evidence-backed knowledge explorer."
        body="REVIVE structures peer-reviewed research, public health guidelines, and learning science into evidence-graded knowledge items."
      />

      {/* Live Search Input */}
      <Card style={{ padding: "22px", marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              type="text"
              placeholder="Search REVIVE knowledge (e.g., 'dopamine', 'retrieval practice', 'why procrastination', 'sleep')..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px 12px 42px",
                borderRadius: "12px",
                border: "1px solid var(--line)",
                fontSize: "14px",
                background: "var(--surface)"
              }}
            />
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {domains.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "99px",
                fontSize: "11.5px",
                fontWeight: 700,
                border: "1px solid var(--line)",
                background: selectedDomain === d.id ? "var(--accent)" : "transparent",
                color: selectedDomain === d.id ? "white" : "var(--muted)",
                cursor: "pointer"
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Structured Knowledge Cards Grid */}
      <div style={{ display: "grid", gap: "18px", marginBottom: "36px" }} className="source-grid">
        {filteredKnowledge.length > 0 ? (
          filteredKnowledge.map(k => (
            <Card key={k.id} style={{ padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span className="eyebrow" style={{ fontSize: "10px", color: "var(--accent)" }}>
                    {k.domain.toUpperCase()} · {k.topic}
                  </span>
                  <div style={{ font: "700 10px 'DM Mono', monospace", padding: "3px 8px", borderRadius: "99px", background: k.evidenceLevel === "HIGH" ? "#e2eee4" : "var(--amber-soft)", color: k.evidenceLevel === "HIGH" ? "#4c7354" : "var(--amber)" }}>
                    Level: {k.evidenceLevel} ({k.evidenceType})
                  </div>
                </div>

                <h3 style={{ fontSize: "16px", margin: "4px 0 10px", lineHeight: "1.4" }}>{k.claim}</h3>
                <p className="muted" style={{ fontSize: "13px", lineHeight: "1.6", marginBottom: "14px" }}>
                  {k.explanation}
                </p>

                {k.caution && (
                  <div style={{ fontSize: "11px", color: "#ef4444", background: "rgba(239,68,68,0.06)", padding: "8px 12px", borderRadius: "8px", marginBottom: "12px" }}>
                    ⚠️ {k.caution}
                  </div>
                )}
              </div>

              <div>
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--muted)" }}>
                  <span>Source: {k.sourceIds.join(", ")}</span>
                  <span>Reviewed: {k.lastReviewed}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card style={{ gridColumn: "1 / -1", padding: "32px", textAlign: "center" }}>
            <h3>No knowledge cards match "{searchQuery}"</h3>
            <p className="muted">Try searching for broader terms like sleep, dopamine, study, or procrastination.</p>
          </Card>
        )}
      </div>

      {/* Official Sources Registry Table */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle
          eyebrow="Registry"
          title="Official source organizations & guidelines."
          body="REVIVE prioritizes high-reliability guidelines from international health agencies and peer-reviewed literature."
        />
        <div style={{ display: "grid", gap: "12px" }}>
          {sourcesList.map(s => (
            <Card key={s.id} style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="eyebrow" style={{ fontSize: "9.5px" }}>{s.organization} ({s.year})</span>
                <h4 style={{ margin: "2px 0 4px", fontSize: "14.5px" }}>{s.title}</h4>
                <div style={{ display: "flex", gap: "6px" }}>
                  {s.topics.map(t => (
                    <span key={t} style={{ font: "10px 'DM Mono', monospace", background: "var(--surface-2)", padding: "2px 6px", borderRadius: "4px", color: "var(--muted)" }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              <a href={s.url} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: "11px" }}>
                <ExternalLink size={14} /> Open Source
              </a>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Notice Card */}
      <Card className="safety-card">
        <ShieldAlert size={20} />
        <div>
          <span className="eyebrow">Safety & Non-Diagnostic Principles</span>
          <h2>REVIVE is an observational & educational workspace.</h2>
          <p>
            Persistent, worsening, or concerning physical or psychological symptoms should be discussed with an appropriate medical clinician or mental health provider. REVIVE helps organize your daily observations; it does not diagnose medical or psychological conditions.
          </p>
        </div>
      </Card>
    </div>
  );
}
