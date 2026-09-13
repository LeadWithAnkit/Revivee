import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Droplets, Moon, Brain, Utensils, Activity, BookOpen, X, Sparkles, Dumbbell } from "lucide-react";
import { Card, Metric, SectionTitle } from "../components/ui";
import { useAppData } from "../hooks/useAppData";
import { monthTitle } from "../lib/format";
import type { Observation } from "../lib/db";

function getRating(o?: Observation): number {
  if (!o) return 0;
  const positive = (o.energy + o.concentration + o.motivation + o.sleepQuality) / 4;
  const stressFactor = (10 - o.studyStress + (10 - o.escapeUrge)) / 2;
  const score = Math.round((positive * 0.7 + stressFactor * 0.3) * 10) / 10;
  return Math.min(10, Math.max(1, score));
}

function getRatingBadge(score: number) {
  if (score >= 8.5) return { label: "Excellent Vitality", color: "#10b981", bg: "rgba(16, 185, 129, 0.18)", border: "#10b981" };
  if (score >= 7.0) return { label: "Balanced Focus", color: "#2d5f63", bg: "rgba(45, 95, 99, 0.16)", border: "#2d5f63" };
  if (score >= 5.0) return { label: "Moderate Recovery", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)", border: "#3b82f6" };
  if (score >= 3.0) return { label: "Mild Stress / Low Energy", color: "#d97706", bg: "rgba(217, 119, 6, 0.16)", border: "#d97706" };
  return { label: "Fatigued / Rest Needed", color: "#ef4444", bg: "rgba(239, 68, 68, 0.16)", border: "#ef4444" };
}

export default function Calendar() {
  const { observations, sessions } = useAppData();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: (first + 6) % 7 + days }, (_, i) => i < (first + 6) % 7 ? null : i - (first + 6) % 7 + 1);

  const byDate = useMemo(() => Object.fromEntries(observations.map(o => [o.date, o])), [observations]);
  const chosen = selected ? byDate[selected] : null;
  const daySessions = selected ? sessions.filter(s => s.date === selected) : [];

  return (
    <div className="page">
      <SectionTitle
        eyebrow="Calendar & Mind Wellness Matrix"
        title="See your patterns mapped across the month."
        body="Days are dynamically color-coded based on scientific mind wellness metrics (sleep, energy, focus, and stress resilience)."
      />

      <div className="calendar-layout">
        <Card className="calendar-card">
          <div className="calendar-head">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month">
              <ChevronLeft />
            </button>
            <h2>{monthTitle(cursor)}</h2>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month">
              <ChevronRight />
            </button>
          </div>

          <div className="weekdays">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(x => (
              <span key={x}>{x}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const o = byDate[date];
              const score = getRating(o);
              const badge = getRatingBadge(score);

              return (
                <button
                  key={date}
                  className={`day-cell ${o ? "has-data" : ""} ${selected === date ? "selected-day" : ""}`}
                  onClick={() => setSelected(date)}
                  style={
                    o
                      ? {
                          background: badge.bg,
                          borderColor: badge.border,
                          borderWidth: "1px",
                          borderStyle: "solid"
                        }
                      : {}
                  }
                >
                  <span style={{ fontWeight: 700 }}>{d}</span>
                  {o && (
                    <div className="day-dots" style={{ marginTop: "14px" }}>
                      <i style={{ opacity: Math.max(0.3, o.energy / 10), background: badge.color }} />
                      <i style={{ opacity: Math.max(0.3, o.concentration / 10), background: "#3b82f6" }} />
                      <i style={{ opacity: Math.max(0.3, (10 - o.studyStress) / 10), background: "#10b981" }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scientific Color Legend */}
          <div className="calendar-legend-box" style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
            <span className="eyebrow" style={{ fontSize: "10px", marginBottom: "8px" }}>Scientific Wellness Spectrum (1–10)</span>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "11px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} /> 9–10 Excellent
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2d5f63" }} /> 7–8 Balanced
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#3b82f6" }} /> 5–6 Moderate
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#d97706" }} /> 3–4 Stress
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <i style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} /> 1–2 Rest
              </span>
            </div>
          </div>
        </Card>

        {/* Detailed Full Observation Snapshot */}
        <Card className="day-detail">
          {!chosen ? (
            <div className="day-empty">
              <span className="eyebrow">Select a day</span>
              <h3>Open a full daily snapshot.</h3>
              <p>Click on any date cell to view complete data including fluid intake, sleep breakdown, mental energy, and study sessions.</p>
            </div>
          ) : (
            <>
              <div className="detail-head" style={{ marginBottom: "18px" }}>
                <div>
                  <span className="eyebrow">{selected}</span>
                  <h2 style={{ margin: "4px 0 2px" }}>Complete Snapshot</h2>
                  {(() => {
                    const score = getRating(chosen);
                    const badge = getRatingBadge(score);
                    return (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "4px",
                          padding: "4px 10px",
                          borderRadius: "99px",
                          fontSize: "11px",
                          fontWeight: 700,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`
                        }}
                      >
                        Wellness Score: {score}/10 · {badge.label}
                      </span>
                    );
                  })()}
                </div>
                <button onClick={() => setSelected(null)} aria-label="Close detail">
                  <X size={18} />
                </button>
              </div>

              {/* Core Overview Metrics */}
              <div className="metrics-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
                <Metric label="Energy" value={`${chosen.energy}/10`} />
                <Metric label="Focus" value={`${chosen.concentration}/10`} />
                <Metric label="Mood" value={`${chosen.motivation}/10`} />
                <Metric label="Sleep" value={`${chosen.sleepHours}h`} />
              </div>

              <div className="divider" style={{ margin: "16px 0" }} />

              {/* Full Detailed Breakdown Groups */}
              <div className="detail-groups" style={{ gap: "18px" }}>
                {/* 1. Hydration & Water Drank */}
                <DetailSection icon={<Droplets size={16} color="#3b82f6" />} title="Hydration & Fluid Intake">
                  <div className="detail-grid-box" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "var(--ink)" }}>
                    <div>💧 <strong>Water Drank:</strong> {chosen.fluidLitres} Litres</div>
                    <div>🌵 <strong>Thirst Level:</strong> {chosen.thirst}/10</div>
                    <div>🚽 <strong>Urination Frequency:</strong> {chosen.urineFrequency} times/day</div>
                    <div>🎨 <strong>Urine Colour Scale:</strong> {chosen.urineColour}/5 {chosen.urineColour <= 2 ? "(Hydrated)" : "(Concentrated)"}</div>
                    <div style={{ gridColumn: "1/-1" }}>🧪 <strong>Strong / Unusual Smell:</strong> {chosen.unusualUrineSmell ? "Yes (Noted)" : "No"}</div>
                  </div>
                </DetailSection>

                {/* 2. Sleep & Recovery */}
                <DetailSection icon={<Moon size={16} color="#665e8f" />} title="Sleep & Rest Architecture">
                  <div className="detail-grid-box" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "var(--ink)" }}>
                    <div>🛌 <strong>Estimated Duration:</strong> {chosen.sleepHours} Hours</div>
                    <div>⭐ <strong>Sleep Quality:</strong> {chosen.sleepQuality}/10</div>
                    <div>🔔 <strong>Awakenings:</strong> {chosen.awakenings} night interruption(s)</div>
                    <div>😴 <strong>Daytime Sleepiness:</strong> {chosen.daytimeSleepiness}/10</div>
                  </div>
                </DetailSection>

                {/* 2.5. Activities & Physical Movement */}
                <DetailSection icon={<Dumbbell size={16} color="#10b981" />} title="Activities & Physical Movement">
                  <div className="detail-grid-box" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "var(--ink)" }}>
                    <div>🚶 <strong>Walk Distance:</strong> {chosen.walkKm ?? 0} km</div>
                    <div>💪 <strong>Push-ups:</strong> {chosen.pushups ?? 0} reps</div>
                    <div>☀️ <strong>Morning Sunlight:</strong> {chosen.sunlightMinutes ?? 0} mins</div>
                    <div>🧘 <strong>Stretching & Mobility:</strong> {chosen.mobilityMinutes ?? 0} mins</div>
                    <div style={{ gridColumn: "1/-1" }}>🏃 <strong>Cardio / Exercise:</strong> {chosen.cardioMinutes ?? 0} mins</div>
                  </div>
                </DetailSection>

                {/* 3. Mind, Attention & Stress */}
                <DetailSection icon={<Brain size={16} color="#2d5f63" />} title="Mind, Attention & Stress">
                  <div className="detail-grid-box" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "var(--ink)" }}>
                    <div>🎯 <strong>Motivation:</strong> {chosen.motivation}/10</div>
                    <div>🔍 <strong>Concentration:</strong> {chosen.concentration}/10</div>
                    <div>😊 <strong>Enjoyment:</strong> {chosen.enjoyment}/10</div>
                    <div>❤️ <strong>Emotional Engagement:</strong> {chosen.emotionalEngagement}/10</div>
                    <div>⚡ <strong>Study Stress:</strong> {chosen.studyStress}/10</div>
                    <div>🏃 <strong>Escape / Avoid Urge:</strong> {chosen.escapeUrge}/10</div>
                    <div style={{ gridColumn: "1/-1" }}>📱 <strong>Phone Urges Count:</strong> {chosen.phoneUrges} check(s) recorded</div>
                  </div>
                </DetailSection>

                {/* 4. Food & Digestion */}
                <DetailSection icon={<Utensils size={16} color="#9b7040" />} title="Food & Digestion">
                  <div className="detail-grid-box" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "var(--ink)" }}>
                    <div>🍽️ <strong>Meal Size:</strong> {chosen.mealSize}</div>
                    <div>🍎 <strong>Appetite:</strong> {chosen.appetite}</div>
                    <div>🪨 <strong>Post-Meal Heaviness:</strong> {chosen.postMealHeaviness}/10</div>
                    <div>💤 <strong>Post-Meal Sleepiness:</strong> {chosen.postMealSleepiness}/10</div>
                    {chosen.digestion && <div style={{ gridColumn: "1/-1" }}>📝 <strong>Digestion Notes:</strong> {chosen.digestion}</div>}
                  </div>
                </DetailSection>

                {/* 5. Physical Symptoms & Markers */}
                <DetailSection icon={<Activity size={16} color="#9a5c58" />} title="Physical Symptoms & Markers">
                  <div className="detail-grid-box" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "var(--ink)" }}>
                    <div>🤕 <strong>Headache / Tension:</strong> {chosen.headache ? "Yes" : "No"}</div>
                    <div>💪 <strong>Neck & Shoulder Tension:</strong> {chosen.muscleAches ? "Yes" : "No"}</div>
                    <div>🏜️ <strong>Dry Mouth (Stress Sign):</strong> {chosen.dryMouth ? "Yes" : "No"}</div>
                    <div>👁️ <strong>Eye Fatigue / Strain:</strong> {(chosen.eyeFatigue ?? chosen.tasteChanges) ? "Yes" : "No"}</div>
                    <div style={{ gridColumn: "1/-1" }}>⚡ <strong>Physical Lethargy / Somatic Fatigue:</strong> {(chosen.somaticFatigue ?? chosen.toothSensation) ? "Yes" : "No"}</div>
                  </div>
                </DetailSection>

                {/* 6. Study Sessions & Reflection */}
                <DetailSection icon={<BookOpen size={16} color="#2d5f63" />} title="Study & Reflection Log">
                  <div style={{ fontSize: "12px", color: "var(--ink)", display: "grid", gap: "6px" }}>
                    <div>⏱️ <strong>Focused Minutes:</strong> {chosen.focusedMinutes} mins ({chosen.focusBlocks} blocks)</div>
                    <div>📖 <strong>Subjects:</strong> {chosen.subjects || "None recorded"}</div>
                    {chosen.distractions && <div>🚫 <strong>Distractions:</strong> {chosen.distractions}</div>}
                    {chosen.helped && <div>💡 <strong>What Helped:</strong> {chosen.helped}</div>}
                    {chosen.notes && <div>📌 <strong>Notes:</strong> {chosen.notes}</div>}

                    {daySessions.length > 0 && (
                      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed var(--line)" }}>
                        <span className="eyebrow" style={{ fontSize: "10px" }}>Recorded Sessions</span>
                        {daySessions.map(s => (
                          <div key={s.id} style={{ fontSize: "11px", margin: "4px 0", padding: "6px 8px", background: "var(--surface-2)", borderRadius: "6px" }}>
                            <strong>{s.subject}</strong> · {s.topic} ({s.minutes}m, Focus: {s.focus}/10)
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DetailSection>
              </div>

              <div style={{ marginTop: "20px", display: "flex", gap: "6px", alignItems: "center", fontSize: "11px", color: "var(--muted)" }}>
                <Sparkles size={14} /> <span>Observations are pattern indicators, not diagnostic claims.</span>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function DetailSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface-2)", padding: "14px 16px", borderRadius: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
        {icon}
        <strong style={{ fontSize: "13px", color: "var(--ink)" }}>{title}</strong>
      </div>
      {children}
    </div>
  );
}
