import { useEffect, useRef, useState } from "react";
import { Wind, Footprints, Volume2, VolumeX, RotateCcw, Play, Pause, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card } from "./ui";
import { db } from "../lib/db";
import { soothingSounds } from "../lib/soundEffects";

export function ResetPanel({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<"breath" | "walk" | "audio" | "grounding">("breath");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context reference for 432Hz Calm Audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Reset timer when tab changes
  useEffect(() => {
    setRunning(false);
    setCompleted(false);
    stopAudio();
    if (activeTab === "breath") setSecondsLeft(60);
    if (activeTab === "walk") setSecondsLeft(120);
  }, [activeTab]);

  // Timer countdown handler with soothing sound effects
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          setCompleted(true);
          if (soundEnabled) soothingSounds.playCompletionChime();
          logResetSuccess(activeTab);
          return 0;
        }

        if (soundEnabled) {
          if (activeTab === "breath" && (prev - 1) % 4 === 0) {
            soothingSounds.playPhaseChime();
          } else {
            soothingSounds.playTick();
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, activeTab, soundEnabled]);

  // Log session completion to IndexedDB
  const logResetSuccess = async (type: string) => {
    try {
      await db.putIntervention({
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        intervention: `${type.toUpperCase()} Reset`,
        context: "State Reset",
        before: 7,
        after: 3,
        helpfulness: 1
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 432Hz Soundscape Player Toggle
  const toggleCalmAudio = () => {
    if (audioPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432 Hz Healing Frequency

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setAudioPlaying(true);
    } catch (err) {
      console.error("Audio initialization error", err);
    }
  };

  const stopAudio = () => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          oscRef.current?.stop();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
          oscRef.current = null;
          gainRef.current = null;
        }, 500);
      } catch {
        // ignore
      }
    }
    setAudioPlaying(false);
  };

  // Comfortable Slow Breathing Phase (4s Inhale, 2s Hold, 6s Exhale) - No uncomfortable breath holding
  const getBreathPhase = () => {
    if (!running) return "Ready to start (Keep breathing comfortable)";
    const elapsed = 60 - secondsLeft;
    const phaseIndex = Math.floor((elapsed % 12) / 2); // 12-second cycle: 0-1 Inhale (4s), 2 Hold (2s), 3-5 Exhale (6s)
    if (phaseIndex < 2) return "Inhale gently (4s)...";
    if (phaseIndex === 2) return "Soft pause (2s)...";
    return "Exhale slowly (6s)...";
  };

  const getBreathScale = () => {
    if (!running) return 1;
    const elapsed = 60 - secondsLeft;
    const phaseIndex = Math.floor((elapsed % 12) / 2);
    if (phaseIndex < 2) return 1.25; // Inhale expansion
    if (phaseIndex === 2) return 1.25; // Pause
    return 0.85; // Slow Exhale contraction
  };


  return (
    <Card className={compact ? "reset-compact" : "reset-panel"}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="reset-icon">
            <Wind size={20} color="var(--accent)" />
          </div>
          <div>
            <span className="eyebrow" style={{ margin: 0 }}>
              State Reset
            </span>
            <h3 style={{ fontSize: "17px", margin: "2px 0 0", color: "var(--ink)", fontWeight: 700 }}>
              Change state, then return.
            </h3>
          </div>
        </div>
        {completed && (
          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={14} /> Completed
          </span>
        )}
      </div>

      <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: "0 0 18px", lineHeight: "1.5" }}>
        Optional, evidence-informed support. Choose one minimal protocol to calm over-arousal and transition into your next micro-action.
      </p>

      {/* Mode Selectors */}
      <div className="reset-tools" style={{ marginBottom: "22px" }}>
        <button className={activeTab === "breath" ? "active" : ""} onClick={() => setActiveTab("breath")}>
          <Wind size={16} /> <b>60s Box Breath</b>
        </button>
        <button className={activeTab === "walk" ? "active" : ""} onClick={() => setActiveTab("walk")}>
          <Footprints size={16} /> <b>2m Physical Shift</b>
        </button>
        <button className={activeTab === "audio" ? "active" : ""} onClick={() => setActiveTab("audio")}>
          <Volume2 size={16} /> <b>432Hz Sound</b>
        </button>
        {!compact && (
          <button className={activeTab === "grounding" ? "active" : ""} onClick={() => setActiveTab("grounding")}>
            <RotateCcw size={16} /> <b>5-4-3-2-1 Grounding</b>
          </button>
        )}
      </div>

      {/* Interactive Active Content Box */}
      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {activeTab === "breath" && (
          <>
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                border: "2px solid var(--accent)",
                background: "color-mix(in srgb, var(--accent-soft) 40%, transparent)",
                display: "grid",
                placeItems: "center",
                transform: `scale(${getBreathScale()})`,
                transition: "transform 3.8s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: running ? "0 0 25px color-mix(in srgb, var(--accent) 30%, transparent)" : "none"
              }}
            >
              <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--ink)", fontFamily: "'DM Mono', monospace" }}>
                {secondsLeft}s
              </span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)" }}>{getBreathPhase()}</span>
            <small style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", display: "block" }}>
              Keep breathing comfortable. Stop if you feel dizzy or uncomfortable.
            </small>
            <div style={{ display: "flex", gap: "10px", marginTop: "4px", alignItems: "center" }}>

              <button
                className="btn btn-primary"
                onClick={() => setRunning(r => !r)}
                style={{ padding: "8px 18px", fontSize: "12px", gap: "6px" }}
              >
                {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Start 60s Breath"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setSoundEnabled(s => !s)}
                style={{ padding: "8px 10px", color: soundEnabled ? "var(--accent)" : "var(--muted)" }}
                title={soundEnabled ? "Soothing Audio: ON" : "Soothing Audio: OFF"}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setRunning(false);
                  setSecondsLeft(60);
                  setCompleted(false);
                }}
                style={{ padding: "8px 12px" }}
                title="Reset"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </>
        )}

        {activeTab === "walk" && (
          <>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--ink)", fontFamily: "'DM Mono', monospace" }}>
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", maxWidth: "360px", margin: 0 }}>
              Step away from screens. Take a 2-minute walk, stretch your spine, or get a glass of water to reset nervous system arousal.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "4px", alignItems: "center" }}>
              <button
                className="btn btn-primary"
                onClick={() => setRunning(r => !r)}
                style={{ padding: "8px 18px", fontSize: "12px", gap: "6px" }}
              >
                {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Start 2m Shift"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setSoundEnabled(s => !s)}
                style={{ padding: "8px 10px", color: soundEnabled ? "var(--accent)" : "var(--muted)" }}
                title={soundEnabled ? "Soothing Audio: ON" : "Soothing Audio: OFF"}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setRunning(false);
                  setSecondsLeft(120);
                  setCompleted(false);
                }}
                style={{ padding: "8px 12px" }}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </>
        )}

        {activeTab === "audio" && (
          <>
            <Volume2 size={36} color="var(--accent)" style={{ animation: audioPlaying ? "pulse 2s infinite" : "none" }} />
            <div>
              <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "var(--ink)" }}>Pure 432Hz Calm Frequency</h4>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                Harmonically tuned pure tone to ground mental agitation without lyrics or narrative distractions.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={toggleCalmAudio}
              style={{ padding: "9px 20px", fontSize: "12.5px", gap: "8px" }}
            >
              {audioPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{audioPlaying ? "Stop Audio" : "Play 432Hz Soundscape"}</span>
            </button>
          </>
        )}

        {activeTab === "grounding" && (
          <div style={{ textAlign: "left", width: "100%" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "var(--ink)", textAlign: "center" }}>
              5-4-3-2-1 Sensory Grounding
            </h4>
            <div style={{ display: "grid", gap: "8px", fontSize: "12px", color: "var(--muted)" }}>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--line)" }}>
                <strong>5 Things:</strong> Name 5 objects around your room right now.
              </div>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--line)" }}>
                <strong>4 Textures:</strong> Feel 4 physical textures (desk, clothes, chair, floor).
              </div>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--line)" }}>
                <strong>3 Sounds:</strong> Listen for 3 ambient sounds in your background.
              </div>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--line)" }}>
                <strong>2 Scents:</strong> Notice 2 subtle smells around your space.
              </div>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--line)" }}>
                <strong>1 Breath:</strong> Take 1 slow, deep abdominal breath.
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
