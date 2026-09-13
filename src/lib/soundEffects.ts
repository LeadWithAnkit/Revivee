// Web Audio API Synthesizer for Aesthetic & Soothing Countdown Sounds

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soothingSounds = {
  // Soft, warm droplet tick played per second during countdown
  playTick(volume = 0.08) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft sine wave centered around soothing 528Hz (Solfeggio tone)
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, now);
      // Gentle frequency bend for an organic water-drop / soft woodblock effect
      osc.frequency.exponentialRampToValueAtTime(396, now + 0.06);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio context might be restricted before user gesture
    }
  },

  // Soft double-chime for breathing phase transitions
  playPhaseChime(volume = 0.12) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      [432, 648].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(volume, now + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.95);
      });
    } catch {
      // Ignore audio errors
    }
  },

  // Peaceful 3-tone harmonic chime when timer / countdown completes
  playCompletionChime(volume = 0.15) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Solfeggio / 432Hz Pentatonic Harmonic Triad (A3 - E4 - A4)
      const chord = [432, 540, 648, 864];

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(volume, now + i * 0.12 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 1.85);
      });
    } catch {
      // Ignore audio errors
    }
  }
};
