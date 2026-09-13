import { useEffect, useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X, Shield, ArrowRight, CheckCircle2, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../hooks/useAppData";
import { db } from "../lib/db";
import { processCompanionQuery } from "../ai/reviveEngine";
import type { CompanionResponse } from "../ai/responseProvider";

interface Msg {
  id: string;
  role: "bot" | "user";
  text: string;
  evidenceBadge?: { level: string; source: string };
  actionLabel?: string;
  actionType?: string;
  interventionId?: string;
  cautionNotice?: string;
  feedbackGiven?: boolean;
}

export function Chatbot() {
  const { observations, sessions, interventions, refresh } = useAppData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "init-1",
      role: "bot",
      text: "Hi. I am REVIVE's evidence-informed companion. I combine your local observations with structured research. What do you need right now?",
      evidenceBadge: { level: "HIGH", source: "REVIVE Companion" }
    }
  ]);

  const suggestions = useMemo(() => [
    "What should I do today?",
    "I can't study",
    "I'm distracted",
    "Explain dopamine",
    "How was my sleep?",
    "Show my patterns"
  ], []);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEv = e as CustomEvent<{ query?: string }>;
      setOpen(true);
      if (customEv.detail?.query) {
        send(customEv.detail.query);
      }
    };
    window.addEventListener("revive-open-companion", handler);
    return () => window.removeEventListener("revive-open-companion", handler);
  }, [observations, sessions, interventions]);

  const handleActionClick = (actionType?: string) => {
    setOpen(false);
    if (actionType === "start-5m" || actionType === "breath-hold" || actionType === "memory-sprint" || actionType === "capture-distraction") {
      navigate("/focus");
    } else if (actionType === "open-reset") {
      navigate("/reset");
    } else if (actionType === "log-tracker") {
      navigate("/tracker");
    } else {
      navigate("/focus");
    }
  };

  const handleFeedback = async (msgId: string, interventionName: string, rating: number) => {
    await db.putIntervention({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      intervention: interventionName || "Companion Intervention",
      context: "Companion Chat Feedback",
      before: 4,
      after: 7,
      helpfulness: rating
    });
    await refresh();

    setMessages(msgs => msgs.map(m => m.id === msgId ? { ...m, feedbackGiven: true } : m));
  };

  const send = async (text = input) => {
    const query = text.trim();
    if (!query || loading) return;

    const userMsgId = crypto.randomUUID();
    const botMsgId = crypto.randomUUID();

    setMessages(m => [...m, { id: userMsgId, role: "user", text: query }]);
    setInput("");
    setLoading(true);

    try {
      const res: CompanionResponse = await processCompanionQuery(query, observations, sessions, interventions);
      setMessages(m => [
        ...m,
        {
          id: botMsgId,
          role: "bot",
          text: res.text,
          evidenceBadge: res.evidenceBadge,
          actionLabel: res.actionLabel,
          actionType: res.actionType,
          interventionId: res.interventionId,
          cautionNotice: res.cautionNotice
        }
      ]);
    } catch {
      setMessages(m => [
        ...m,
        {
          id: botMsgId,
          role: "bot",
          text: "I am ready to help you decide your next small action. Try asking: 'I can't study' or 'What should I do today?'",
          evidenceBadge: { level: "HIGH", source: "REVIVE Guide" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open REVIVE Companion">
          <MessageCircle size={22} />
          <span>Companion</span>
        </button>
      )}

      {open && (
        <>
          <div className="chat-mobile-backdrop" onClick={() => setOpen(false)} />
          <div className="chat-panel">
            <div className="chat-head">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bot size={18} color="var(--accent)" />
                <div>
                  <b style={{ fontSize: "14px", color: "var(--ink)" }}>REVIVE Companion</b>
                  <span style={{ display: "block", fontSize: "10px", color: "var(--muted)", font: "400 10px 'DM Mono', monospace" }}>
                    Evidence-Informed · Local & Private
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: 0, color: "var(--muted)", cursor: "pointer", padding: "4px" }}
                aria-label="Close Companion"
              >
                <X size={18} />
              </button>
            </div>

          <div className="chat-messages" style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map(m => (
              <div key={m.id} className={`chat-bubble ${m.role}`} style={{ maxWidth: "90%", whiteSpace: "pre-line", fontSize: "13px", lineHeight: "1.55" }}>
                {m.role === "bot" && m.evidenceBadge && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", font: "600 10px 'DM Mono', monospace", color: "var(--accent)" }}>
                    <Shield size={12} />
                    <span>Evidence: {m.evidenceBadge.level}</span>
                    <span style={{ color: "var(--muted)" }}>| {m.evidenceBadge.source}</span>
                  </div>
                )}

                {m.text}

                {m.cautionNotice && (
                  <div style={{ marginTop: "8px", padding: "8px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: "11px", fontWeight: 500 }}>
                    ⚠️ {m.cautionNotice}
                  </div>
                )}

                {/* Primary Action Button */}
                {m.role === "bot" && m.actionLabel && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      className="btn btn-soft"
                      onClick={() => handleActionClick(m.actionType)}
                      style={{ fontSize: "11px", padding: "6px 12px", width: "100%", justifyContent: "space-between" }}
                    >
                      <span>{m.actionLabel}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                {/* Did that help? Interactive Outcome Feedback */}
                {m.role === "bot" && m.actionLabel && !m.feedbackGiven && (
                  <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed var(--line)", fontSize: "11px", color: "var(--muted)" }}>
                    <span style={{ display: "block", marginBottom: "6px" }}>Did that help?</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleFeedback(m.id, m.actionLabel!, 10)} className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: "10px" }}>
                        <ThumbsUp size={11} /> Better
                      </button>
                      <button onClick={() => handleFeedback(m.id, m.actionLabel!, 5)} className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: "10px" }}>
                        <Minus size={11} /> Same
                      </button>
                      <button onClick={() => handleFeedback(m.id, m.actionLabel!, 1)} className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: "10px" }}>
                        <ThumbsDown size={11} /> Worse
                      </button>
                    </div>
                  </div>
                )}

                {m.feedbackGiven && (
                  <div style={{ marginTop: "6px", fontSize: "10px", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> Outcome recorded locally.
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot" style={{ fontSize: "12px", color: "var(--muted)" }}>
                Thinking...
              </div>
            )}
          </div>

          <div className="chat-suggestions" style={{ padding: "8px 12px", borderTop: "1px solid var(--line)", display: "flex", gap: "6px", overflowX: "auto" }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "99px", whiteSpace: "nowrap" }}>
                {s}
              </button>
            ))}
          </div>

          <div className="chat-input" style={{ padding: "10px 14px", borderTop: "1px solid var(--line)", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask REVIVE Companion..."
              style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "12.5px" }}
            />
            <button className="btn btn-primary" onClick={() => send()} style={{ padding: "8px 12px" }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      </>
    )}
  </>
  );
}
