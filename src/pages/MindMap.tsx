import { useMemo, useState } from "react";
import { Info, MessageCircle, Play, Activity, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mindEdges, mindNodes, type Evidence, evidenceMeta } from "../data/content";
import { Card, EvidenceBadge, SectionTitle } from "../components/ui";
import { useAppData } from "../hooks/useAppData";

export default function MindMap() {
  const navigate = useNavigate();
  const { observations, sessions } = useAppData();
  const [selected, setSelected] = useState("attention");
  const [hovered, setHovered] = useState<string | null>(null);
  const [evidenceFilter, setEvidenceFilter] = useState<"all" | Evidence>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const nodeMap = useMemo(() => Object.fromEntries(mindNodes.map(n => [n.id, n])), []);

  // Filter edges based on evidence level filter
  const visibleEdges = useMemo(() => {
    return mindEdges.filter(e => evidenceFilter === "all" || e[3] === evidenceFilter);
  }, [evidenceFilter]);

  // Compute live 7-day average metrics from IndexedDB observations
  const personalDataMap = useMemo(() => {
    const validObs = observations.slice(0, 7);
    if (validObs.length === 0) return {};

    const avg = (fn: (o: typeof validObs[0]) => number) => {
      const vals = validObs.map(fn).filter(v => v !== undefined && !isNaN(v));
      if (vals.length === 0) return 0;
      return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
    };

    return {
      sleep: `Your 7-day Avg: ${avg(o => o.sleepHours)}h · Quality: ${avg(o => o.sleepQuality)}/10`,
      hydration: `Fluid Intake: ${avg(o => o.fluidLitres)}L · Thirst: ${avg(o => o.thirst)}/10`,
      nutrition: `Post-meal Heaviness: ${avg(o => o.postMealHeaviness)}/10 · Sleepiness: ${avg(o => o.postMealSleepiness)}/10`,
      physical: `Body Energy Level: ${avg(o => o.energy)}/10`,
      attention: `Concentration: ${avg(o => o.concentration)}/10 · Daily Focus: ${avg(o => o.focusedMinutes)}m`,
      avoidance: `Escape Urge: ${avg(o => o.escapeUrge)}/10 · Phone Urges: ${avg(o => o.phoneUrges)}/10`,
      mood: `Motivation: ${avg(o => o.motivation)}/10 · Enjoyment: ${avg(o => o.enjoyment)}/10`,
      stress: `Study Stress: ${avg(o => o.studyStress)}/10 · Focus Blocks: ${avg(o => o.focusBlocks)}`,
      alex: `Emotional Engagement: ${avg(o => o.emotionalEngagement)}/10`
    };
  }, [observations]);

  // Determine active node (hovered node or selected node)
  const activeNodeId = hovered || selected;

  // Check if an edge is connected to the active node
  const isEdgeConnected = (a: string, b: string) => {
    return activeNodeId === a || activeNodeId === b;
  };

  const activeNode = nodeMap[selected] || mindNodes[0];

  return (
    <div className="page">
      <SectionTitle
        eyebrow="Personal Wellbeing & Cognitive Ecosystem"
        title="Interactive bio-cognitive pattern map."
        body="Biological recovery, attention, and study stress form an interconnected network. Select any node to view live personal data, evidence levels, and direct actions."
      />

      {/* Control Bar: Category Systems & Evidence Filters */}
      <Card style={{ padding: "16px 20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", alignSelf: "center", marginRight: "4px" }}>
              Systems:
            </span>
            {[
              { id: "all", label: "All Systems" },
              { id: "physical", label: "Physical Foundation" },
              { id: "cognitive", label: "Attention & Behavior" },
              { id: "emotional", label: "Mood & Stress" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`btn ${categoryFilter === cat.id ? "btn-primary" : "btn-ghost"}`}
                style={{ fontSize: "11px", padding: "5px 12px" }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", alignSelf: "center", marginRight: "4px" }}>
              Evidence:
            </span>
            <button
              onClick={() => setEvidenceFilter("all")}
              className={`btn ${evidenceFilter === "all" ? "btn-soft" : "btn-ghost"}`}
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              All Levels
            </button>
            {(["strong", "plausible", "association", "uncertain"] as Evidence[]).map(x => (
              <button
                key={x}
                onClick={() => setEvidenceFilter(x)}
                className={`btn ${evidenceFilter === x ? "btn-soft" : "btn-ghost"}`}
                style={{ fontSize: "11px", padding: "4px 10px" }}
              >
                {evidenceMeta[x].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Interactive 2D Network Canvas & Detail Split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }} className="mindmap-responsive-grid">
        {/* Graph Canvas */}
        <Card style={{ position: "relative", height: "520px", overflow: "hidden", padding: 0 }} className="mindmap-canvas-container">
          <svg
            className="map-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          >
            {visibleEdges.map(([a, b, label, level], i) => {
              const s = nodeMap[a];
              const t = nodeMap[b];
              if (!s || !t) return null;
              const connected = isEdgeConnected(a, b);
              return (
                <g key={i} className={`edge ${level}`} style={{ opacity: activeNodeId ? (connected ? 1 : 0.15) : 0.6, transition: "opacity 0.25s ease" }}>
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={connected ? "var(--accent)" : level === "strong" ? "var(--accent)" : "var(--muted)"}
                    strokeWidth={connected ? "1.8" : "1"}
                    strokeDasharray={level === "association" || level === "uncertain" ? "2 2" : "none"}
                  />
                  <text
                    x={(s.x + t.x) / 2}
                    y={(s.y + t.y) / 2 - 1.5}
                    textAnchor="middle"
                    fill={connected ? "var(--ink)" : "var(--muted)"}
                    fontSize="2.8"
                    fontWeight={connected ? "bold" : "normal"}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Render 2D Nodes */}
          {mindNodes.map(n => {
            const isVisible = categoryFilter === "all" || n.category === categoryFilter;
            const isSelectedNode = selected === n.id;
            const isHoveredNode = hovered === n.id;
            const liveMetric = personalDataMap[n.id as keyof typeof personalDataMap];

            return (
              <button
                key={n.id}
                className={`mind-node ${n.tone} ${isSelectedNode ? "selected" : ""}`}
                style={{
                  position: "absolute",
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: isVisible ? 1 : 0.2,
                  scale: isSelectedNode || isHoveredNode ? "1.08" : "1",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: isSelectedNode ? "2px solid var(--accent)" : "1px solid var(--line)",
                  background: isSelectedNode ? "var(--surface)" : "var(--surface-2)",
                  boxShadow: isSelectedNode ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
                  cursor: "pointer",
                  zIndex: isSelectedNode ? 10 : 2
                }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(n.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <strong style={{ fontSize: "13px", color: "var(--ink)" }}>{n.title}</strong>
                  {liveMetric && <span style={{ width: "6px", height: "6px", borderRadius: "99px", background: "#10b981" }} />}
                </div>
                <span style={{ display: "block", fontSize: "10.5px", color: "var(--muted)", marginTop: "2px" }}>{n.sub}</span>
              </button>
            );
          })}
        </Card>

        {/* Selected Node Live Metrics & Action Panel */}
        <Card className="mindmap-detail-card" style={{ padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span className="eyebrow" style={{ color: "var(--accent)", fontSize: "10px" }}>
                SELECTED ECOSYSTEM NODE
              </span>
              <EvidenceBadge level={selected === "alex" ? "association" : selected === "stress" ? "uncertain" : "plausible"} />
            </div>

            <h2 style={{ fontSize: "20px", margin: "0 0 6px", color: "var(--ink)" }}>{activeNode.title}</h2>
            <p className="muted" style={{ fontSize: "13px", margin: "0 0 16px" }}>
              {activeNode.sub}
            </p>

            {/* Live Personal Data Card */}
            <div style={{ padding: "14px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--line)", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontSize: "11px", fontWeight: 700, color: "var(--ink)" }}>
                <Activity size={14} color="var(--accent)" />
                <span>IndexedDB 7-Day Live Observation</span>
              </div>
              <p style={{ fontSize: "12.5px", margin: 0, color: "var(--ink)", fontWeight: 500 }}>
                {personalDataMap[activeNode.id as keyof typeof personalDataMap] || "No entries logged yet. Log daily check-ins to view personal averages."}
              </p>
            </div>

            <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: "1.6", marginBottom: "20px" }}>
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>Scientific Framing: </span>
              This node reflects mutual feedback loops in human physiology and cognition. Changes in {activeNode.title.toLowerCase()} carry observational associations with your overall focus state without implying single causality or diagnosis.
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/focus")}
              style={{ width: "100%", justifyContent: "space-between", fontSize: "12px" }}
            >
              <span>Try Focus Reset Tool</span>
              <Play size={14} />
            </button>

            <button
              className="btn btn-soft"
              onClick={() => navigate("/tracker")}
              style={{ width: "100%", justifyContent: "space-between", fontSize: "12px" }}
            >
              <span>Log Daily Check-in</span>
              <CheckCircle2 size={14} />
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("revive-open-companion", {
                    detail: { query: `Explain ${activeNode.title} in REVIVE` }
                  })
                );
              }}
              style={{ width: "100%", justifyContent: "space-between", fontSize: "12px" }}
            >
              <span>Ask REVIVE Companion</span>
              <MessageCircle size={14} />
            </button>
          </div>
        </Card>
      </div>

      {/* Non-Causality & Safety Note */}
      <Card style={{ padding: "18px 24px", marginTop: "24px", display: "flex", alignItems: "center", gap: "14px" }}>
        <Info size={20} color="var(--accent)" />
        <div style={{ fontSize: "12px", color: "var(--muted)" }}>
          <strong style={{ color: "var(--ink)" }}>Non-Causality Principle: </strong>
          Relationships in REVIVE are framed as observational patterns, not diagnostic proof. Use this mind map as a tool for personal awareness and trial experiments.
        </div>
      </Card>
    </div>
  );
}
