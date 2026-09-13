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
];

class FocusSoundEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentSoundId: string | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public playSound(item: SoundscapeItem) {
    this.stop(); // Stop all existing nodes
    this.initCtx();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (item.freqLeft && item.freqRight) {
      // Binaural or Pure Tone Frequency
      const oscLeft = this.ctx.createOscillator();
      const oscRight = this.ctx.createOscillator();
      const merger = this.ctx.createChannelMerger(2);

      oscLeft.type = "sine";
      oscLeft.frequency.setValueAtTime(item.freqLeft, this.ctx.currentTime);

      oscRight.type = "sine";
      oscRight.frequency.setValueAtTime(item.freqRight, this.ctx.currentTime);

      oscLeft.connect(merger, 0, 0);
      oscRight.connect(merger, 0, 1);
      merger.connect(this.gainNode);

      oscLeft.start();
      oscRight.start();

      this.activeNodes.push(oscLeft, oscRight);
    } else {
      // Noise Soundscape Generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (item.noiseType === "brown") {
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (item.noiseType === "pink") {
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
          output[i] *= 2.2;
        } else {
          output[i] = white * 0.4;
        }
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = item.noiseType === "brown" ? "lowpass" : "bandpass";
      filter.frequency.setValueAtTime(item.filterFreq || 600, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      noiseSource.start();

      this.activeNodes.push(noiseSource);
    }

    this.isPlaying = true;
    this.currentSoundId = item.id;
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // Safe catch
      }
    });
    this.activeNodes = [];

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // Safe catch
      }
      this.gainNode = null;
    }

    if (this.ctx && this.ctx.state === "running") {
      try {
        this.ctx.suspend();
      } catch {
        // Safe catch
      }
    }

    this.isPlaying = false;
    this.currentSoundId = null;
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public getStatus() {
    return { isPlaying: this.isPlaying, currentSoundId: this.currentSoundId };
  }
}

export const focusAudio = new FocusSoundEngine();
