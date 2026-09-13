import { SectionTitle } from "../components/ui";
import { ResetPanel } from "../components/ResetPanel";
import { Compass, Target } from "lucide-react";

export default function Reset() {
  return (
    <div className="page">
      <SectionTitle
        eyebrow="Quieter Minute"
        title="Reset your state."
        body="Choose one low-friction protocol to calm over-arousal and transition cleanly into your next step."
      />

      {/* Main Minimal Reset Panel */}
      <ResetPanel />

      {/* Supporting Minimal Cards */}
      <div className="reset-grid" style={{ marginTop: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Compass size={18} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: "16px", color: "var(--ink)" }}>When to use it</h3>
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
            Before restarting a difficult task, after a distraction spiral, or when transitioning between high-intensity work blocks.
          </p>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Target size={18} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: "16px", color: "var(--ink)" }}>The Intended Outcome</h3>
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
            The reset is only a bridge. The goal is to start a tiny real-world action: open the document, stand up, or write your next sentence.
          </p>
        </div>
      </div>
    </div>
  );
}
