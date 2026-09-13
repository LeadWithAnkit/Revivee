import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, Shield, TimerReset, Volume2, VolumeX, Gamepad2, Tv, X, Sparkles, Brain, Check, RefreshCw, ExternalLink, Link2, Shuffle, Plus, Trash2, Eye, Ear, Hand, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, Metric, SectionTitle } from "../components/ui";
import { db } from "../lib/db";
import { useAppData } from "../hooks/useAppData";
import { catTopics } from "../data/content";
import { focusAudio, soundscapeDatabase, type SoundscapeItem } from "../lib/audio";
import { soothingSounds } from "../lib/soundEffects";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  embedUrl: string;
  watchUrl: string;
  description: string;
}

// Curated matrix of viral TEDx, Andrew Huberman, and Personality Building talks (100% embeddable)
const curatedVideoPools: VideoItem[][] = [
  // Pool 1: Neuroscience & Health (Dr. Andrew Huberman & Neurobiology)
  [
    {
      id: "huberman-focus",
      title: "Dr. Andrew Huberman: Optimize Focus & Brain Health",
      category: "Neuroscience",
      embedUrl: "https://www.youtube.com/embed/WwZ8gE5QvWk?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=WwZ8gE5QvWk",
      description: "Neurobiology tools for deep focus, regulating dopamine, and building mental stamina."
    },
    {
      id: "kelly-stress",
      title: "Kelly McGonigal: How to Make Stress Your Friend",
      category: "TED Talk",
      embedUrl: "https://www.youtube.com/embed/RcGyVTAoXEU?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=RcGyVTAoXEU",
      description: "Renowned TED talk on reshaping your body's stress response into resilience and focus."
    },
    {
      id: "shauna-mindfulness",
      title: "Dr. Shauna Shapiro: What You Practice Grows Stronger",
      category: "Mental Health",
      embedUrl: "https://www.youtube.com/embed/IeblJdB2-Vo?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=IeblJdB2-Vo",
      description: "Neuroscience of mindfulness, self-compassion, and breaking anxious feedback loops."
    }
  ],
  // Pool 2: Viral TEDx Talks & Mindset Mastery
  [
    {
      id: "tim-procrastination",
      title: "Tim Urban: Inside the Mind of a Master Procrastinator",
      category: "Viral TED Talk",
      embedUrl: "https://www.youtube.com/embed/arj7oStGLkU?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=arj7oStGLkU",
      description: "The viral TED talk explaining the Instant Gratification Monkey and how to overcome delay loops."
    },
    {
      id: "mel-robbins",
      title: "Mel Robbins: How to Stop Screwing Yourself Over",
      category: "Personality Building",
      embedUrl: "https://www.youtube.com/embed/Lp7E973zozc?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=Lp7E973zozc",
      description: "Powerful insights on overcoming mental friction, activation energy, and taking action."
    },
    {
      id: "alia-crum",
      title: "Dr. Alia Crum: Change Your Mindset, Change Your Reality",
      category: "Mindset Science",
      embedUrl: "https://www.youtube.com/embed/0tqq66zV3gU?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=0tqq66zV3gU",
      description: "Stanford researcher explains how subjective mindsets alter physical stress and performance."
    }
  ],
  // Pool 3: Personality Building & Resilience
  [
    {
      id: "angela-grit",
      title: "Angela Lee Duckworth: Grit - Passion & Perseverance",
      category: "Personality Building",
      embedUrl: "https://www.youtube.com/embed/H14bBuluwB8?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=H14bBuluwB8",
      description: "Why grit and long-term perseverance predict success better than raw IQ or motivation."
    },
    {
      id: "brain-power",
      title: "Jim Kwik: Unlock Your Super Brain & Focus",
      category: "Brain Optimization",
      embedUrl: "https://www.youtube.com/embed/7XFLTDQ4JMk?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=7XFLTDQ4JMk",
      description: "Mindset techniques to eliminate brain fog, learn faster, and maintain concentration."
    },
    {
      id: "joan-rosenberg",
      title: "Dr. Joan Rosenberg: Emotional Mastery & Strength",
      category: "Personality Building",
      embedUrl: "https://www.youtube.com/embed/v-74vDjhOgU?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=v-74vDjhOgU",
      description: "How riding 90-second waves of unpleasant emotion builds unshakeable confidence."
    }
  ],
  // Pool 4: Habit Building & Escaping Distraction Loops
  [
    {
      id: "jonathan-bricker",
      title: "Dr. Jonathan Bricker: The Secret to Self-Control",
      category: "Habit Science",
      embedUrl: "https://www.youtube.com/embed/tTb3d5cjBOs?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=tTb3d5cjBOs",
      description: "Acceptance-based techniques for conquering phone urges, procrastination, and cravings."
    },
    {
      id: "judson-brewer",
      title: "Dr. Judson Brewer: A Simple Way to Break a Bad Habit",
      category: "TED Talk",
      embedUrl: "https://www.youtube.com/embed/F6eFFCi12v8?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=F6eFFCi12v8",
      description: "Psychiatrist reveals curiosity-based mindfulness to step out of obsessive feedback loops."
    },
    {
      id: "carol-dweck",
      title: "Dr. Carol Dweck: The Power of Believing You Can Improve",
      category: "Growth Mindset",
      embedUrl: "https://www.youtube.com/embed/_X0mgO4pUrU?autoplay=1&rel=0",
      watchUrl: "https://www.youtube.com/watch?v=_X0mgO4pUrU",
      description: "The foundational research on Growth Mindset vs. Fixed Mindset for overcoming failure."
    }
  ]
];

export default function Focus() {
  const { sessions, refresh } = useAppData();
  const [minutes, setMinutes] = useState(5);
  const [left, setLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const [subject, setSubject] = useState("Quant");
  const [topic, setTopic] = useState("Arithmetic");
  const [distractions, setDistractions] = useState<string[]>([]);

  // Audio State & Daily Shuffling
  const [audioShuffleOffset, setAudioShuffleOffset] = useState(0);
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.2);

  // Interactive Exercises State
  const [activeExercise, setActiveExercise] = useState<"reset60" | "friction" | "unload" | "anchor">("reset60");
  
  // 1. 60s Reset Interactive State
  const [reset60Step, setReset60Step] = useState(0);
  const [reset60Timer, setReset60Timer] = useState(60);
  const [reset60Active, setReset60Active] = useState(false);

  // 2. Friction Breaker State
  const [bigTaskInput, setBigTaskInput] = useState("");
  const [shrunkSteps, setShrunkSteps] = useState<{ step: string; mins: number }[]>([]);

  // 3. Mental Unload Workspace State
  const [thoughtInput, setThoughtInput] = useState("");
  const [thoughtTag, setThoughtTag] = useState<"now" | "later" | "drop">("now");
  const [unloadItems, setUnloadItems] = useState<{ id: string; text: string; tag: "now" | "later" | "drop" }[]>([
    { id: "1", text: "Solve 1 basic question", tag: "now" },
    { id: "2", text: "Review tomorrow's formula sheet", tag: "later" }
  ]);

  // 4. Sensory Anchor Step State
  const [anchorStep, setAnchorStep] = useState(0);

  // 60s Reset Timer Effect
  useEffect(() => {
    if (!reset60Active) return;
    const interval = setInterval(() => {
      setReset60Timer(t => {
        if (t <= 1) {
          setReset60Active(false);
          soothingSounds.playCompletionChime();
          return 0;
        }
        if (t % 15 === 0 && t < 60) {
          setReset60Step(s => Math.min(3, s + 1));
          soothingSounds.playPhaseChime();
        } else {
          soothingSounds.playTick();
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [reset60Active]);

  // Handle Shrinking Task
  const handleShrinkTask = () => {
    if (!bigTaskInput.trim()) return;
    const task = bigTaskInput.trim();
    setShrunkSteps([
      { step: `Open ${task} & view page/file 1`, mins: 2 },
      { step: `Complete micro-part #1 of ${task}`, mins: 5 },
      { step: `Review or decide whether to stop`, mins: 5 }
    ]);
  };

  const launchMicroStep = (stepText: string, durationMins: number) => {
    setTopic(stepText.slice(0, 30));
    setMinutes(durationMins);
    setLeft(durationMins * 60);
    setRunning(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mental Unload Handlers
  const handleAddThought = () => {
    if (!thoughtInput.trim()) return;
    setUnloadItems(prev => [...prev, { id: crypto.randomUUID(), text: thoughtInput.trim(), tag: thoughtTag }]);
    setThoughtInput("");
  };

  const handleDeleteThought = (id: string) => {
    setUnloadItems(prev => prev.filter(item => item.id !== id));
  };


  // Video Shuffling & Modal State
  const [shuffleOffset, setShuffleOffset] = useState(0);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [customUrl, setCustomUrl] = useState("");

  // Daily Shuffled Audio Tracks (Displays 3 items from 14 soundscape database)
  const displayAudioTracks = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const tracks: SoundscapeItem[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = (dayOfYear * 2 + i + audioShuffleOffset) % soundscapeDatabase.length;
      tracks.push(soundscapeDatabase[idx]);
    }
    return tracks;
  }, [audioShuffleOffset]);

  // Calculate daily shuffled videos (4 distinct categories)
  const displayVideos = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return curatedVideoPools.map((pool, idx) => {
      const videoIndex = (dayOfYear + idx + shuffleOffset) % pool.length;
      return pool[videoIndex];
    });
  }, [shuffleOffset]);

  // Clean up audio on page unmount
  useEffect(() => {
    return () => {
      focusAudio.stop();
    };
  }, []);

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Main Timer Effect
  useEffect(() => {
    setLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft(s => {
        if (s <= 1) {
          setRunning(false);
          if (soundEnabled) soothingSounds.playCompletionChime();
          return 0;
        }
        if (soundEnabled) soothingSounds.playTick();
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, soundEnabled]);



  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  const log = async () => {
    const elapsed = Math.max(1, Math.round((minutes * 60 - left) / 60));
    await db.putSession({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      subject,
      topic,
      minutes: elapsed,
      focus: 7,
      distractions: distractions.length,
      completed: left === 0,
      note: ""
    });
    await refresh();
    setDistractions([]);
    setLeft(minutes * 60);
  };

  const total = sessions.filter(s => s.date === new Date().toISOString().slice(0, 10)).reduce((a, b) => a + b.minutes, 0);

  // Audio Handler
  const toggleSound = (item: SoundscapeItem) => {
    if (activeSoundId === item.id) {
      focusAudio.stop();
      setActiveSoundId(null);
    } else {
      focusAudio.playSound(item);
      setActiveSoundId(item.id);
    }
  };

  const stopAllAudio = () => {
    focusAudio.stop();
    setActiveSoundId(null);
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    focusAudio.setVolume(v);
  };

  // Custom Video Load Handler
  const loadCustomVideo = () => {
    if (!customUrl.trim()) return;
    let videoId = "";
    if (customUrl.includes("v=")) {
      videoId = customUrl.split("v=")[1]?.split("&")[0] || "";
    } else if (customUrl.includes("youtu.be/")) {
      videoId = customUrl.split("youtu.be/")[1]?.split("?")[0] || "";
    } else {
      videoId = customUrl.trim();
    }

    if (videoId) {
      setActiveVideo({
        id: "custom",
        title: "Custom Focus / Study Stream",
        category: "Custom Video",
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        description: "User supplied focus video stream."
      });
      setCustomUrl("");
    }
  };


  return (
    <div className="page focus-page">
      <SectionTitle
        eyebrow="Focus lab"
        title="Make starting easier."
        body="Choose a tiny output, protect it for a few minutes, then decide whether to continue."
      />

      <div className="focus-grid">
        <Card className="focus-main">
          <div className="focus-context">
            <span className="eyebrow">Today's target</span>
            <h3>
              {subject} · {topic}
            </h3>
            <p>One visible output. No requirement to finish.</p>
          </div>
          <div className={`timer ${running ? "running" : ""}`}>
            <span>
              {mm}:{ss}
            </span>
            <small>{running ? "focused" : "ready"}</small>
          </div>
          <div className="timer-controls">
            <Button onClick={() => setRunning(v => !v)}>
              {running ? <Pause size={17} /> : <Play size={17} />} {running ? "Pause" : "Start"}
            </Button>
            <button
              className="icon-btn"
              onClick={() => setSoundEnabled(s => !s)}
              title={soundEnabled ? "Soothing Countdown Sound: ON" : "Soothing Countdown Sound: OFF"}
              style={{ color: soundEnabled ? "var(--accent)" : "var(--muted)" }}
            >
              {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <button className="icon-btn" onClick={() => { setRunning(false); setLeft(minutes * 60); }} aria-label="Reset timer">
              <RotateCcw size={17} />
            </button>
            <button className="icon-btn" onClick={log} aria-label="Log session">
              <TimerReset size={17} />
            </button>
          </div>
          <div className="duration-pills">
            {[5, 10, 20, 30].map(x => (
              <button className={minutes === x ? "active" : ""} key={x} onClick={() => setMinutes(x)}>
                {x}m
              </button>
            ))}
          </div>
          <div className="focus-meta">
            <Metric label="Today" value={`${total}m`} />
            <Metric label="Distractions" value={distractions.length} />
            <Metric label="Mode" value={minutes <= 10 ? "Minimum" : "Normal"} />
          </div>
        </Card>

        <div className="focus-side">
          <Card>
            <span className="eyebrow">Focus task</span>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              <option>Quant</option>
              <option>VARC</option>
              <option>DILR</option>
            </select>
            <select value={topic} onChange={e => setTopic(e.target.value)}>
              {catTopics
                .filter(x => x.subject === subject)
                .map(x => (
                  <option key={x.topic}>{x.topic}</option>
                ))}
            </select>
            <p className="muted">Suggested: solve 2 basic questions, or review one concept.</p>
          </Card>

          <Card>
            <div className="card-kicker">
              <span>
                <Shield size={15} /> Distraction capture
              </span>
              <span>{distractions.length}</span>
            </div>
            <p className="muted">When you want to switch tabs, write it here instead.</p>
            <div className="distraction-input">
              <input id="dist" placeholder="e.g. check message" />
              <button
                onClick={() => {
                  const el = document.getElementById("dist") as HTMLInputElement;
                  if (el.value.trim()) {
                    setDistractions(d => [...d, el.value.trim()]);
                    el.value = "";
                  }
                }}
              >
                Add
              </button>
            </div>
            {distractions.map((d, i) => (
              <div className="dist-row" key={i}>
                {d}
              </div>
            ))}
          </Card>

          <Card>
            <span className="eyebrow">Minimum-day rule</span>
            <h3>5 minutes counts.</h3>
            <p>
              If today is difficult, stop after the minimum without calling it a failure. Returning tomorrow matters more than a
              perfect block.
            </p>
            <Link to="/tracker">Log how it felt →</Link>
          </Card>
        </div>
      </div>

      <div className="divider" style={{ margin: "36px 0" }} />

      {/* Free Focus Audio & Mind Games + Video Hub */}
      <div style={{ display: "grid", gap: "22px" }} className="focus-extras-grid">
        {/* 1. Free Focus Audio Soundscape Player (4 Track Daily Rotation from 14-Item Database) */}
        <Card style={{ padding: "26px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Volume2 size={20} color="var(--accent)" />
              <span className="eyebrow" style={{ margin: 0 }}>
                Free Ambient Focus Audio
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setAudioShuffleOffset(s => s + 1)}
                style={{ fontSize: "11px", padding: "4px 8px" }}
                title="Shuffle audio tracks"
              >
                <Shuffle size={13} /> Shuffle Tracks
              </button>
              {activeSoundId && (
                <button
                  onClick={stopAllAudio}
                  style={{
                    fontSize: "11px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid var(--line)",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <VolumeX size={13} /> Stop
                </button>
              )}
            </div>
          </div>
          <h3>Daily Shuffled Focus Soundscapes</h3>
          <p className="muted" style={{ fontSize: "13px", marginBottom: "16px" }}>
            3 handpicked acoustic frequencies & soundscapes from our 14-item library—reshuffled daily to calm over-arousal.
          </p>

          <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
            {displayAudioTracks.map(item => (
              <button
                key={item.id}
                className={`btn ${activeSoundId === item.id ? "btn-saved" : "btn-soft"}`}
                onClick={() => toggleSound(item)}
                style={{ justifyContent: "space-between", padding: "10px 14px", textAlign: "left" }}
              >
                <div>
                  <span style={{ fontWeight: 700, display: "block", fontSize: "13px" }}>{item.name}</span>
                  <small style={{ fontSize: "11px", opacity: 0.85, fontWeight: 400 }}>{item.description}</small>
                </div>
                {activeSoundId === item.id ? <Pause size={16} /> : <Play size={16} />}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--surface-2)", padding: "12px 16px", borderRadius: "12px" }}>
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => handleVolume(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "var(--accent)" }}
            />
            <span style={{ font: "11px 'DM Mono', monospace", color: "var(--muted)", width: "35px" }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </Card>

        {/* 2. Interactive Attention & Task Initiation System */}
        <Card style={{ padding: "clamp(16px, 3.5vw, 26px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Brain size={20} color="var(--accent)" />
              <span className="eyebrow" style={{ margin: 0 }}>
                Attention & Task Initiation Protocols
              </span>
            </div>
          </div>

          <p className="muted" style={{ fontSize: "12.5px", marginBottom: "16px", lineHeight: "1.5" }}>
            Interactive behavioral protocols to reduce task initiation friction, clear working memory clutter, and anchor attention.
          </p>

          {/* Responsive Exercise Filter Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", width: "100%" }}>
            <button
              className={`filter-pill ${activeExercise === "reset60" ? "active" : ""}`}
              onClick={() => setActiveExercise("reset60")}
              style={{ padding: "8px 14px", borderRadius: "99px", fontSize: "11.5px", border: "1px solid var(--line)", background: activeExercise === "reset60" ? "var(--accent-soft)" : "transparent", color: activeExercise === "reset60" ? "var(--accent)" : "var(--muted)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
            >
              1. 60s Attention Reset
            </button>
            <button
              className={`filter-pill ${activeExercise === "friction" ? "active" : ""}`}
              onClick={() => setActiveExercise("friction")}
              style={{ padding: "8px 14px", borderRadius: "99px", fontSize: "11.5px", border: "1px solid var(--line)", background: activeExercise === "friction" ? "var(--accent-soft)" : "transparent", color: activeExercise === "friction" ? "var(--accent)" : "var(--muted)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
            >
              2. Task Shrinker
            </button>
            <button
              className={`filter-pill ${activeExercise === "unload" ? "active" : ""}`}
              onClick={() => setActiveExercise("unload")}
              style={{ padding: "8px 14px", borderRadius: "99px", fontSize: "11.5px", border: "1px solid var(--line)", background: activeExercise === "unload" ? "var(--accent-soft)" : "transparent", color: activeExercise === "unload" ? "var(--accent)" : "var(--muted)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
            >
              3. Mental Unload
            </button>
            <button
              className={`filter-pill ${activeExercise === "anchor" ? "active" : ""}`}
              onClick={() => setActiveExercise("anchor")}
              style={{ padding: "8px 14px", borderRadius: "99px", fontSize: "11.5px", border: "1px solid var(--line)", background: activeExercise === "anchor" ? "var(--accent-soft)" : "transparent", color: activeExercise === "anchor" ? "var(--accent)" : "var(--muted)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
            >
              4. 3-Sense Anchor
            </button>
          </div>

          {/* Exercise 1: 60-Second Guided Visual Attention Reset */}
          {activeExercise === "reset60" && (
            <div style={{ background: "var(--surface-2)", padding: "clamp(14px, 3vw, 20px)", borderRadius: "16px", border: "1px solid var(--line)", width: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span className="eyebrow" style={{ color: "var(--accent)", margin: 0, fontSize: "10px" }}>
                  WHY: Restores vagal tone & clears pre-task restlessness
                </span>
                <span style={{ font: "700 12px 'DM Mono', monospace", color: "var(--accent)", background: "var(--surface)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--line)" }}>
                  ⏱️ {reset60Timer}s
                </span>
              </div>

              <h4 style={{ margin: "0 0 12px", fontSize: "16px", color: "var(--ink)", fontWeight: 700 }}>Interactive 60s Attention Reset</h4>

              {/* Step Visual Pulse Focal Point */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "12px auto 18px",
                  borderRadius: "50%",
                  border: "2px solid var(--accent)",
                  background: "color-mix(in srgb, var(--accent-soft) 50%, transparent)",
                  display: "grid",
                  placeItems: "center",
                  animation: reset60Active ? "savePulse 3.5s infinite ease-in-out" : "none",
                  boxShadow: reset60Active ? "0 0 25px color-mix(in srgb, var(--accent) 35%, transparent)" : "none"
                }}
              >
                <Brain size={36} color="var(--accent)" />
              </div>

              {/* Guided Steps Carousel */}
              <div style={{ display: "grid", gap: "8px", marginBottom: "18px" }}>
                {[
                  "1. Move phone & extra browser tabs out of direct sight.",
                  "2. Rest your visual focus on the center pulse ring above.",
                  "3. Take 2–3 comfortable slow breaths. (Stop if feeling dizzy).",
                  "4. Define the single 5-minute micro-task you will start next."
                ].map((stepText, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: reset60Step === idx ? "var(--accent-soft)" : "var(--surface)",
                      border: reset60Step === idx ? "1px solid var(--accent)" : "1px solid var(--line)",
                      color: reset60Step === idx ? "var(--ink)" : "var(--muted)",
                      fontWeight: reset60Step === idx ? 700 : 500,
                      fontSize: "12.5px",
                      transition: "all 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <span style={{ font: "700 12px 'DM Mono', monospace", color: reset60Step === idx ? "var(--accent)" : "var(--muted)" }}>0{idx + 1}</span>
                    <span>{stepText}</span>
                  </div>
                ))}
              </div>

              {/* Controls & Launch */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                <Button
                  onClick={() => setReset60Active(a => !a)}
                  style={{ flex: 1, minWidth: "150px", justifyContent: "center" }}
                >
                  {reset60Active ? <Pause size={15} /> : <Play size={15} />}
                  <span>{reset60Active ? "Pause 60s Reset" : "Start 60s Guided Reset"}</span>
                </Button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setReset60Active(false);
                    setReset60Timer(60);
                    setReset60Step(0);
                  }}
                  style={{ padding: "8px 14px" }}
                >
                  <RotateCcw size={15} /> Reset
                </button>
                <Button
                  variant="soft"
                  onClick={() => launchMicroStep("Micro Focus", 5)}
                  style={{ flex: 1, minWidth: "180px", justifyContent: "center" }}
                >
                  <Sparkles size={15} /> Launch 5m Focus Session
                </Button>
              </div>
            </div>
          )}

          {/* Exercise 2: Interactive Task Shrinker (Friction Breaker) */}
          {activeExercise === "friction" && (
            <div style={{ background: "var(--surface-2)", padding: "clamp(14px, 3vw, 20px)", borderRadius: "16px", border: "1px solid var(--line)", width: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span className="eyebrow" style={{ color: "var(--accent)", margin: 0, fontSize: "10px" }}>
                  WHY: Lowers limbic threat response to eliminate procrastination
                </span>
                <span style={{ font: "700 12px 'DM Mono', monospace", color: "var(--muted)" }}>⏱️ 2 MINUTES</span>
              </div>

              <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--ink)", fontWeight: 700 }}>Interactive Task Shrinker</h4>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 16px" }}>
                Type a task you're avoiding. We'll shrink it until initiation friction vanishes.
              </p>

              {/* Task Input Box */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                <input
                  type="text"
                  placeholder="e.g. Write 10-page report, Study 5 chapters..."
                  value={bigTaskInput}
                  onChange={e => setBigTaskInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleShrinkTask()}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    fontSize: "13px",
                    background: "var(--surface)"
                  }}
                />
                <Button onClick={handleShrinkTask} style={{ minWidth: "120px", justifyContent: "center" }}>
                  <Sparkles size={15} /> Shrink Task
                </Button>
              </div>

              {/* Shrunk Steps Result */}
              {shrunkSteps.length > 0 ? (
                <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
                  <span className="eyebrow" style={{ margin: 0, color: "var(--accent)" }}>Your 3 Micro-Steps:</span>
                  {shrunkSteps.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--surface)",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: "1px solid var(--line)",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >
                      <div>
                        <span style={{ font: "700 11px 'DM Mono', monospace", color: "var(--accent)", display: "block", marginBottom: "2px" }}>
                          STEP {idx + 1} ({s.mins} MINS)
                        </span>
                        <strong style={{ fontSize: "13px", color: "var(--ink)" }}>{s.step}</strong>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => launchMicroStep(s.step, s.mins)}
                        style={{ fontSize: "11px", padding: "6px 12px", gap: "6px" }}
                      >
                        <Play size={13} /> Start ({s.mins}m)
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gap: "8px", fontSize: "12.5px", marginBottom: "16px" }}>
                  <div style={{ background: "var(--surface)", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Instead of <strong>"Study whole chapter"</strong> → <em>"Open page 42 & read title"</em></span>
                    <button className="btn btn-soft" onClick={() => launchMicroStep("Open page 42", 2)} style={{ fontSize: "11px", padding: "4px 10px" }}>Try 2m</button>
                  </div>
                  <div style={{ background: "var(--surface)", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Instead of <strong>"Build entire project"</strong> → <em>"Open project folder & index file"</em></span>
                    <button className="btn btn-soft" onClick={() => launchMicroStep("Open project folder", 2)} style={{ fontSize: "11px", padding: "4px 10px" }}>Try 2m</button>
                  </div>
                </div>
              )}

              <div style={{ background: "var(--surface)", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--line)" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                  "Action creates motivation, not the other way around. Perform only step 1."
                </p>
              </div>
            </div>
          )}

          {/* Exercise 3: Interactive Mental Unload Workspace */}
          {activeExercise === "unload" && (
            <div style={{ background: "var(--surface-2)", padding: "clamp(14px, 3vw, 20px)", borderRadius: "16px", border: "1px solid var(--line)", width: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span className="eyebrow" style={{ color: "var(--accent)", margin: 0, fontSize: "10px" }}>
                  WHY: Clears working memory overload & racing thoughts
                </span>
                <span style={{ font: "700 12px 'DM Mono', monospace", color: "var(--muted)" }}>⏱️ 2 MINUTES</span>
              </div>

              <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--ink)", fontWeight: 700 }}>Mental Unload Workspace</h4>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 16px" }}>
                Write down any thoughts taking up space in your head. Tag them to clear mental clutter.
              </p>

              {/* Add Thought Form */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                <input
                  type="text"
                  placeholder="What is occupying space in your head?"
                  value={thoughtInput}
                  onChange={e => setThoughtInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddThought()}
                  style={{ flex: 1, minWidth: "180px", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "13px", background: "var(--surface)" }}
                />
                <select
                  value={thoughtTag}
                  onChange={e => setThoughtTag(e.target.value as any)}
                  style={{ padding: "10px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "12px", background: "var(--surface)" }}
                >
                  <option value="now">🎯 Do Now (Focus Target)</option>
                  <option value="later">📅 Do Later (Calendar)</option>
                  <option value="drop">🍃 Let Go (Not Actionable)</option>
                </select>
                <Button onClick={handleAddThought} style={{ padding: "10px 16px" }}>
                  <Plus size={15} /> Add
                </Button>
              </div>

              {/* Unloaded Items Grid */}
              <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
                {unloadItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: "var(--surface)",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "99px",
                          background: item.tag === "now" ? "var(--accent-soft)" : item.tag === "later" ? "rgba(59,130,246,0.1)" : "rgba(107,114,128,0.1)",
                          color: item.tag === "now" ? "var(--accent)" : item.tag === "later" ? "#3b82f6" : "var(--muted)"
                        }}
                      >
                        {item.tag === "now" ? "DO NOW" : item.tag === "later" ? "DO LATER" : "LET GO"}
                      </span>
                      <span style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{item.text}</span>
                    </div>

                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      {item.tag === "now" && (
                        <button
                          className="btn btn-primary"
                          onClick={() => launchMicroStep(item.text, 5)}
                          style={{ fontSize: "10.5px", padding: "4px 10px", gap: "4px" }}
                        >
                          <Play size={12} /> Set as Focus Target
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteThought(item.id)}
                        style={{ border: 0, background: "none", color: "var(--muted)", cursor: "pointer", padding: "4px" }}
                        title="Delete thought"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise 4: Interactive 3-Sense Attention Anchor */}
          {activeExercise === "anchor" && (
            <div style={{ background: "var(--surface-2)", padding: "clamp(14px, 3vw, 20px)", borderRadius: "16px", border: "1px solid var(--line)", width: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span className="eyebrow" style={{ color: "var(--accent)", margin: 0, fontSize: "10px" }}>
                  WHY: Grounds sensory awareness in the immediate environment
                </span>
                <span style={{ font: "700 12px 'DM Mono', monospace", color: "var(--muted)" }}>⏱️ 45 SECONDS</span>
              </div>

              <h4 style={{ margin: "0 0 12px", fontSize: "16px", color: "var(--ink)", fontWeight: 700 }}>3-Sense Attention Anchor</h4>

              {/* 3 Sensory Steps Cards */}
              <div style={{ display: "grid", gap: "10px", marginBottom: "18px" }}>
                <div style={{ background: anchorStep === 0 ? "var(--accent-soft)" : "var(--surface)", border: anchorStep === 0 ? "1px solid var(--accent)" : "1px solid var(--line)", padding: "12px 16px", borderRadius: "12px", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Eye size={22} color={anchorStep === 0 ? "var(--accent)" : "var(--muted)"} />
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--ink)" }}>1. Visual Anchor</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Notice 1 object in front of you. Focus on its shape and color for 5 seconds.</span>
                  </div>
                </div>

                <div style={{ background: anchorStep === 1 ? "var(--accent-soft)" : "var(--surface)", border: anchorStep === 1 ? "1px solid var(--accent)" : "1px solid var(--line)", padding: "12px 16px", borderRadius: "12px", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Ear size={22} color={anchorStep === 1 ? "var(--accent)" : "var(--muted)"} />
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--ink)" }}>2. Auditory Anchor</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Listen for 1 ambient sound (fan, distant traffic, your own breath).</span>
                  </div>
                </div>

                <div style={{ background: anchorStep === 2 ? "var(--accent-soft)" : "var(--surface)", border: anchorStep === 2 ? "1px solid var(--accent)" : "1px solid var(--line)", padding: "12px 16px", borderRadius: "12px", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Hand size={22} color={anchorStep === 2 ? "var(--accent)" : "var(--muted)"} />
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--ink)" }}>3. Tactile Anchor</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Feel your feet flat on the floor or the texture of your desk.</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                <Button onClick={() => setAnchorStep(s => (s + 1) % 3)} style={{ flex: 1, justifyContent: "center" }}>
                  <span>Next Sense Step</span> <ArrowRight size={15} />
                </Button>
                <Button variant="soft" onClick={() => launchMicroStep("Anchored Focus", 5)} style={{ flex: 1, justifyContent: "center" }}>
                  <Play size={15} /> Launch 5m Session
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 3. Mindset, Health & Viral TEDx Media Hub */}
      <div style={{ marginTop: "24px" }}>
        <Card style={{ padding: "26px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Tv size={20} color="var(--accent)" />
              <span className="eyebrow" style={{ margin: 0 }}>
                Mindset & Focus Media Hub
              </span>
            </div>

            {/* Daily Shuffle & Custom URL Tools */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShuffleOffset(s => s + 1)}
                style={{ fontSize: "11px", padding: "6px 12px" }}
                title="Shuffle video selections"
              >
                <Shuffle size={13} /> Shuffle Talks
              </button>
              <input
                type="text"
                placeholder="Paste YouTube Link..."
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                style={{ fontSize: "11px", padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--line)", width: "160px" }}
              />
              <button
                className="btn btn-soft"
                onClick={loadCustomVideo}
                style={{ fontSize: "11px", padding: "6px 10px" }}
              >
                <Link2 size={13} /> Load
              </button>
            </div>
          </div>
          <h3>Daily Shuffled TEDx Talks, Dr. Andrew Huberman & Personality Science</h3>
          <p className="muted" style={{ fontSize: "13.5px", marginBottom: "20px" }}>
            Handpicked viral TEDx talks, neuroscience of focus, and habit mastery—shuffled daily to inspire high motivation and resilience.
          </p>

          <div style={{ display: "grid", gap: "16px" }} className="video-card-grid">
            {displayVideos.map(v => (
              <div
                key={v.id}
                style={{
                  background: "var(--surface-2)",
                  padding: "18px",
                  borderRadius: "14px",
                  border: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <span className="eyebrow" style={{ fontSize: "9.5px", color: "var(--accent)" }}>
                    {v.category}
                  </span>
                  <h4 style={{ margin: "4px 0 8px", fontSize: "15px", color: "var(--ink)" }}>{v.title}</h4>
                  <p className="muted" style={{ fontSize: "12px", lineHeight: "1.5", marginBottom: "14px" }}>
                    {v.description}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button variant="soft" onClick={() => setActiveVideo(v)} style={{ flex: 1, justifyContent: "center" }}>
                    <Play size={15} /> Play inside site
                  </Button>
                  <a
                    href={v.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{ padding: "8px 12px" }}
                    title="Open directly in YouTube"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. Responsive Embedded iFrame Video Modal */}
      {activeVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 99,
            display: "grid",
            placeItems: "center",
            padding: "20px"
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div
            style={{
              background: "var(--surface)",
              width: "100%",
              maxWidth: "840px",
              borderRadius: "20px",
              padding: "22px",
              boxShadow: "var(--shadow)",
              border: "1px solid var(--line)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <span className="eyebrow" style={{ margin: 0 }}>
                  {activeVideo.category}
                </span>
                <h3 style={{ margin: "2px 0 0", fontSize: "18px" }}>{activeVideo.title}</h3>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a
                  href={activeVideo.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                  style={{ fontSize: "11px", padding: "6px 10px" }}
                >
                  <ExternalLink size={13} /> Open in YouTube
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  style={{ border: 0, background: "none", color: "var(--muted)", cursor: "pointer", padding: "4px" }}
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* 16:9 Responsive iFrame Container */}
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "14px", background: "#000" }}>
              <iframe
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
