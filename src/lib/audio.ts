// Web Audio API Soundscape & Acoustic Frequency Engine for REVIVE Focus
export interface SoundscapeItem {
  id: string;
  name: string;
  category: "Binaural" | "Nature" | "Frequency" | "Ambient";
  description: string;
  freqLeft?: number;
  freqRight?: number;
  noiseType?: "brown" | "pink" | "white";
  filterFreq?: number;
}

export const soundscapeDatabase: SoundscapeItem[] = [
  {
    id: "binaural-gamma-40",
    name: "🧠 40Hz Gamma Binaural Beats",
    category: "Binaural",
    description: "Working memory stimulation & peak cognitive focus.",
    freqLeft: 200,
    freqRight: 240
  },
  {
    id: "ocean-rain",
    name: "🌧️ Deep Ocean Rain & Thunder",
    category: "Nature",
    description: "Calms sympathetic nervous system over-arousal.",
    noiseType: "brown",
    filterFreq: 550
  },
  {
    id: "alpha-waves",
    name: "🌊 Soft Alpha Waves (10Hz)",
    category: "Binaural",
    description: "Dopamine reset & relaxed alert concentration.",
    freqLeft: 210,
    freqRight: 220
  },
  {
    id: "cafe-ambience",
    name: "☕ Lo-Fi Warm Cafe Murmur",
    category: "Ambient",
    description: "Gentle acoustic background to reduce solitude stress.",
    noiseType: "pink",
    filterFreq: 450
  },
  {
    id: "forest-breeze",
    name: "🌲 Forest Rainfall & Breeze",
    category: "Nature",
    description: "High-entropy natural soundscape for stress reduction.",
    noiseType: "pink",
    filterFreq: 700
  },
  {
    id: "delta-calm",
    name: "🌌 Deep Space Delta (4Hz)",
    category: "Binaural",
    description: "Deep anti-anxiety calm and nervous system rest.",
    freqLeft: 100,
    freqRight: 104
  },
  {
    id: "solfeggio-528",
    name: "⚡ 528Hz Solfeggio Clarity Tone",
    category: "Frequency",
    description: "Harmonic pure tone for mental clarity & anti-fog.",
    freqLeft: 528,
    freqRight: 528
  },
  {
    id: "cozy-fireplace",
    name: "🔥 Warm Fireplace Crackle",
    category: "Ambient",
    description: "Comforting low-frequency acoustic warmth.",
    noiseType: "brown",
    filterFreq: 380
  },
  {
    id: "solfeggio-432",
    name: "🧘 432Hz Serenity Resonance",
    category: "Frequency",
    description: "Harmonically tuned pure tone for emotional balance.",
    freqLeft: 432,
    freqRight: 432
  },
  {
    id: "white-noise",
    name: "🌬️ White Noise Distraction Shield",
    category: "Ambient",
    description: "Masks unpredictable background speech and noise.",
    noiseType: "white",
    filterFreq: 1200
  },
  {
    id: "mountain-wind",
    name: "🍃 Mountain Wind & Quiet Valley",
    category: "Nature",
    description: "Subtle low-frequency breeze to ground attention.",
    noiseType: "brown",
    filterFreq: 260
  },
  {
    id: "theta-rest",
    name: "🌙 Theta Deep Rest (6Hz)",
    category: "Binaural",
    description: "Calms racing thoughts and reduces cognitive overwhelm.",
    freqLeft: 150,
    freqRight: 156
  },
  {
    id: "spring-waterfall",
    name: "💧 Spring Waterfall & Stream",
    category: "Nature",
    description: "Continuous fluid acoustics for sustained reading focus.",
    noiseType: "pink",
    filterFreq: 950
  },
  {
    id: "pink-noise-shield",
    name: "🪐 Cosmic Pink Noise",
    category: "Ambient",
    description: "Balanced 1/f sound spectrum for cognitive restoration.",
    noiseType: "pink",
    filterFreq: 800
  }
    {
    id: "Hans-Zimmer",
    name: "🪐 Inception track",
    category: "Ambient",
    description: "Balanced 1/f sound spectrum for cognitive restoration.",
    noiseType: "white",
    filterFreq: 800
  }
];

class FocusSoundEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private intermediateNodes: AudioNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentSoundId: string | null = null;
  private masterVol = 0.45;
  private stopTimeoutId: number | null = null;

  constructor() {
    const saved = localStorage.getItem("revive_master_volume");
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        this.masterVol = parsed;
      }
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.ctx.onstatechange = () => {
        if (this.ctx && this.ctx.state === "suspended" && this.isPlaying) {
          this.ctx.resume().catch(() => {});
        }
      };
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public playSound(item: SoundscapeItem) {
    // Cancel any pending stop timeouts from previous calls to prevent premature node killing
    if (this.stopTimeoutId !== null) {
      clearTimeout(this.stopTimeoutId);
      this.stopTimeoutId = null;
    }

    this.stopImmediate(); // Instantly tear down existing nodes without delay
    this.initCtx();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    const now = this.ctx.currentTime;
    // Smooth linear gain ramp to eliminate audio clicks
    this.gainNode.gain.setValueAtTime(0.001, now);
    this.gainNode.gain.linearRampToValueAtTime(this.masterVol, now + 0.15);
    this.gainNode.connect(this.ctx.destination);

    if (item.freqLeft && item.freqRight) {
      // Binaural or Pure Frequency Synthesizer
      const oscLeft = this.ctx.createOscillator();
      const oscRight = this.ctx.createOscillator();
      const merger = this.ctx.createChannelMerger(2);

      oscLeft.type = "sine";
      oscLeft.frequency.setValueAtTime(item.freqLeft, now);

      oscRight.type = "sine";
      oscRight.frequency.setValueAtTime(item.freqRight, now);

      oscLeft.connect(merger, 0, 0);
      oscRight.connect(merger, 0, 1);
      merger.connect(this.gainNode);

      oscLeft.start(now);
      oscRight.start(now);

      this.activeNodes.push(oscLeft, oscRight);
      this.intermediateNodes.push(merger);
    } else {
      // Noise Soundscape Generator (Brown / Pink / White)
      const bufferSize = this.ctx.sampleRate * 3; // 3 second continuous looping buffer
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (item.noiseType === "brown") {
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.2;
        } else if (item.noiseType === "pink") {
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
          output[i] *= 2.0;
        } else {
          output[i] = white * 0.35;
        }
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = item.noiseType === "brown" ? "lowpass" : "bandpass";
      filter.frequency.setValueAtTime(item.filterFreq || 600, now);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      noiseSource.start(now);

      this.activeNodes.push(noiseSource);
      this.intermediateNodes.push(filter);
    }

    this.isPlaying = true;
    this.currentSoundId = item.id;
  }

  private stopImmediate() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // Safe catch
      }
    });
    this.activeNodes = [];

    this.intermediateNodes.forEach(node => {
      try {
        node.disconnect();
      } catch {
        // Safe catch
      }
    });
    this.intermediateNodes = [];

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // Safe catch
      }
      this.gainNode = null;
    }
  }

  public stop() {
    if (this.stopTimeoutId !== null) {
      clearTimeout(this.stopTimeoutId);
      this.stopTimeoutId = null;
    }

    if (this.gainNode && this.ctx && this.ctx.state === "running") {
      try {
        const now = this.ctx.currentTime;
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.12);
      } catch {
        // Safe catch
      }
    }

    // Capture nodes to tear down after fade-out
    const nodesToStop = [...this.activeNodes];
    const intersToStop = [...this.intermediateNodes];
    const gainToStop = this.gainNode;

    this.activeNodes = [];
    this.intermediateNodes = [];
    this.gainNode = null;
    this.isPlaying = false;
    this.currentSoundId = null;

    this.stopTimeoutId = window.setTimeout(() => {
      nodesToStop.forEach(node => {
        try {
          node.stop();
          node.disconnect();
        } catch {
          // Safe catch
        }
      });
      intersToStop.forEach(node => {
        try {
          node.disconnect();
        } catch {
          // Safe catch
        }
      });
      if (gainToStop) {
        try {
          gainToStop.disconnect();
        } catch {
          // Safe catch
        }
      }
      this.stopTimeoutId = null;
    }, 130);
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterVol = clamped;
    localStorage.setItem("revive_master_volume", clamped.toString());
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  public getVolume() {
    return this.masterVol;
  }

  public getStatus() {
    return { isPlaying: this.isPlaying, currentSoundId: this.currentSoundId, volume: this.masterVol };
  }
}

export const focusAudio = new FocusSoundEngine();


