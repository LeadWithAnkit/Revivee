import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, Shield, TimerReset, Volume2, VolumeX, Gamepad2, Tv, X, Sparkles, Brain, Check, RefreshCw, ExternalLink, Link2, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, Metric, SectionTitle } from "../components/ui";
import { db } from "../lib/db";
import { useAppData } from "../hooks/useAppData";
import { catTopics } from "../data/content";
import { focusAudio, soundscapeDatabase, type SoundscapeItem } from "../lib/audio";

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

  // Stopwatch & Mind Game State
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [activeGame, setActiveGame] = useState<"breath" | "memory">("breath");
  const [memSequence, setMemSequence] = useState<number[]>([]);
  const [memInput, setMemInput] = useState("");
  const [memResult, setMemResult] = useState<"idle" | "success" | "fail">("idle");

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
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Stopwatch Effect
  useEffect(() => {
    if (!swRunning) return;
    const id = setInterval(() => {
      setSwTime(t => t + 10);
    }, 10);
    return () => clearInterval(id);
  }, [swRunning]);

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

  // Memory Game Logic
  const startMemoryGame = () => {
    const seq = Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1);
    setMemSequence(seq);
    setMemInput("");
    setMemResult("idle");
  };

  const checkMemory = () => {
    if (memInput === memSequence.join("")) {
      setMemResult("success");
    } else {
      setMemResult("fail");
    }
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

  // Format Stopwatch
  const swMinutes = String(Math.floor(swTime / 60000)).padStart(2, "0");
  const swSeconds = String(Math.floor((swTime % 60000) / 1000)).padStart(2, "0");
  const swMillis = String(Math.floor((swTime % 1000) / 100));

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

        {/* 2. Mind Games & Live Stopwatch Card */}
        <Card style={{ padding: "26px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Gamepad2 size={20} color="var(--accent)" />
              <span className="eyebrow" style={{ margin: 0 }}>
                Mind Focus Exercises
              </span>
            </div>
            {/* Live Stopwatch Clock Display */}
            <div
              style={{
                font: "700 15px 'DM Mono', monospace",
                background: "var(--surface-2)",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                color: "var(--accent)"
              }}
            >
              ⏱️ {swMinutes}:{swSeconds}.{swMillis}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button
              className={`filter-pill ${activeGame === "breath" ? "active" : ""}`}
              onClick={() => setActiveGame("breath")}
              style={{ padding: "6px 12px", borderRadius: "99px", fontSize: "11px", border: "1px solid var(--line)", background: activeGame === "breath" ? "var(--accent-soft)" : "transparent", color: activeGame === "breath" ? "var(--accent)" : "var(--muted)", fontWeight: 700 }}
            >
              1. Single-Point Breath Hold
            </button>
            <button
              className={`filter-pill ${activeGame === "memory" ? "active" : ""}`}
              onClick={() => setActiveGame("memory")}
              style={{ padding: "6px 12px", borderRadius: "99px", fontSize: "11px", border: "1px solid var(--line)", background: activeGame === "memory" ? "var(--accent-soft)" : "transparent", color: activeGame === "memory" ? "var(--accent)" : "var(--muted)", fontWeight: 700 }}
            >
              2. 5-Digit Working Memory Sprint
            </button>
          </div>

          {/* Game 1: Single Point Breath & Attention Hold */}
          {activeGame === "breath" && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <p className="muted" style={{ fontSize: "12.5px", marginBottom: "14px" }}>
                Focus your vision on the rhythmic pulse below. Press start on the live stopwatch to train attention hold.
              </p>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                  border: "2px solid var(--accent)",
                  display: "grid",
                  placeItems: "center",
                  animation: swRunning ? "savePulse 4s infinite ease-in-out" : "none"
                }}
              >
                <Brain size={32} color="var(--accent)" />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <Button variant="soft" onClick={() => setSwRunning(r => !r)}>
                  {swRunning ? <Pause size={15} /> : <Play size={15} />} {swRunning ? "Pause Clock" : "Start Stopwatch"}
                </Button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setSwRunning(false);
                    setSwTime(0);
                  }}
                >
                  <RotateCcw size={15} /> Reset
                </button>
              </div>
            </div>
          )}

          {/* Game 2: Working Memory Sprint */}
          {activeGame === "memory" && (
            <div style={{ padding: "10px 0" }}>
              <p className="muted" style={{ fontSize: "12.5px", marginBottom: "12px" }}>
                Memorize the generated sequence, then type it back. Uses the live clock to measure cognitive speed.
              </p>

              {memSequence.length === 0 ? (
                <Button onClick={startMemoryGame}>
                  <Sparkles size={16} /> Generate Sequence
                </Button>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ font: "800 24px 'DM Mono', monospace", letterSpacing: "8px", color: "var(--accent)", textAlign: "center" }}>
                    {memSequence.join(" ")}
                  </div>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="Enter 5 digits..."
                    value={memInput}
                    onChange={e => setMemInput(e.target.value)}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", textAlign: "center", font: "700 18px 'DM Mono', monospace" }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button onClick={checkMemory} style={{ flex: 1 }}>
                      Check Answer
                    </Button>
                    <button className="btn btn-ghost" onClick={startMemoryGame}>
                      <RefreshCw size={15} /> New
                    </button>
                  </div>
                  {memResult === "success" && (
                    <div style={{ color: "#10b981", fontWeight: 700, fontSize: "13px", textAlign: "center", display: "flex", gap: "6px", alignItems: "center", justifyContent: "center" }}>
                      <Check size={16} /> Excellent recall in {swMinutes}:{swSeconds}!
                    </div>
                  )}
                  {memResult === "fail" && (
                    <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "13px", textAlign: "center" }}>
                      Not quite — try again!
                    </div>
                  )}
                </div>
              )}
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
