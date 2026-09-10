/** Lofi EDM chapter bed. Generated on intent. Nothing ships in the artifact. */

const BPM = 88;
const LOOKAHEAD = 0.12;
const SIXTEENTH = 60 / BPM / 4;
const MASTER = 0.82;

const CHAPTER_SHIFT: Record<string, number> = {
  open: 0,
  method: 3,
  systems: -2,
  lightsaber: 7,
  role: 5,
  tour: -5,
  shown: 2,
  parallax: 9,
  solo: 4,
  broadcast: -3,
  architect: 5,
  fleet: 0,
  answer: 7,
};

const CHORDS = [
  [0, 3, 7, 10],
  [8, 12, 15, 19],
  [3, 7, 10, 14],
  [10, 14, 17, 21],
];

function midi(n: number) {
  return 440 * Math.pow(2, (n - 69) / 12);
}

function noiseBuffer(ctx: AudioContext, seconds = 1.4) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export type LofiBed = {
  start: () => Promise<void>;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setChapter: (id: string) => void;
  dispose: () => void;
};

export function createLofiBed(): LofiBed {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let padFilter: BiquadFilterNode | null = null;
  let padGain: GainNode | null = null;
  let crackle: AudioBufferSourceNode | null = null;
  let timer = 0;
  let nextTime = 0;
  let step = 0;
  let running = false;
  let muted = false;
  let shift = 0;
  let chord = 0;
  let noise: AudioBuffer | null = null;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 8;
    compressor.ratio.value = 1.8;
    compressor.attack.value = 0.008;
    compressor.release.value = 0.16;
    master.connect(compressor);
    compressor.connect(ctx.destination);

    padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 980;
    padFilter.Q.value = 0.65;
    padGain = ctx.createGain();
    padGain.gain.value = 0.22;
    padGain.connect(padFilter);
    padFilter.connect(master);

    noise = noiseBuffer(ctx);
    crackle = ctx.createBufferSource();
    crackle.buffer = noise;
    crackle.loop = true;
    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = "highpass";
    crackleFilter.frequency.value = 1800;
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.04;
    crackle.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(master);
    crackle.start();
    return ctx;
  }

  function env(node: AudioParam, t: number, peak: number, attack: number, release: number) {
    node.cancelScheduledValues(t);
    node.setValueAtTime(0.0001, t);
    node.exponentialRampToValueAtTime(peak, t + attack);
    node.exponentialRampToValueAtTime(0.0001, t + attack + release);
  }

  function kick(t: number) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(96, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.14);
    env(gain.gain, t, 1.15, 0.004, 0.22);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.28);
    if (padGain) {
      padGain.gain.cancelScheduledValues(t);
      padGain.gain.setValueAtTime(0.08, t);
      padGain.gain.exponentialRampToValueAtTime(0.22, t + 0.22);
    }
  }

  function clap(t: number) {
    if (!ctx || !master || !noise) return;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1600;
    filter.Q.value = 1.2;
    const gain = ctx.createGain();
    env(gain.gain, t, 0.48, 0.003, 0.12);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t);
    src.stop(t + 0.16);
  }

  function hat(t: number, open = false) {
    if (!ctx || !master || !noise) return;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = open ? 7000 : 9000;
    const gain = ctx.createGain();
    env(gain.gain, t, open ? 0.16 : 0.1, 0.002, open ? 0.14 : 0.04);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t);
    src.stop(t + (open ? 0.18 : 0.06));
  }

  function bass(t: number, degree: number) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = midi(33 + shift + degree);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, t);
    filter.frequency.exponentialRampToValueAtTime(90, t + 0.2);
    env(gain.gain, t, 0.55, 0.01, 0.28);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  function chordHit(t: number) {
    if (!ctx || !padGain) return;
    const tones = CHORDS[chord % CHORDS.length] ?? CHORDS[0];
    for (const [i, degree] of tones.entries()) {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? "triangle" : "sine";
      osc.frequency.value = midi(57 + shift + degree) * (i === 0 ? 0.5 : 1);
      osc.detune.value = (i - 1.5) * 7;
      const g = ctx.createGain();
      g.gain.value = 0.42 / tones.length;
      osc.connect(g);
      g.connect(padGain);
      osc.start(t);
      osc.stop(t + (60 / BPM) * 4 + 0.05);
    }
    if (padFilter) {
      const open = 920 + (chord % 4) * 110 + Math.abs(shift) * 12;
      padFilter.frequency.setTargetAtTime(open, t, 0.4);
    }
  }

  function schedule(beat: number, t: number) {
    const swung = beat % 2 === 1 ? t + SIXTEENTH * 0.16 : t;
    if (beat === 0 || beat === 8) kick(t);
    if (beat === 4 || beat === 12) clap(swung);
    if (beat % 2 === 0) hat(swung, beat === 14);
    if (beat === 6 || beat === 10 || beat === 14) hat(swung, false);
    if (beat === 0 || beat === 8) bass(t, CHORDS[chord % CHORDS.length]?.[0] ?? 0);
    if (beat === 6 || beat === 14) bass(swung, (CHORDS[chord % CHORDS.length]?.[0] ?? 0) + 7);
    if (beat === 0) {
      chordHit(t);
      chord = (chord + 1) % CHORDS.length;
    }
  }

  function tick() {
    if (!ctx || !running) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      schedule(step, nextTime);
      nextTime += SIXTEENTH;
      step = (step + 1) % 16;
    }
    timer = window.setTimeout(tick, 25);
  }

  return {
    async start() {
      const ac = ensure();
      if (ac.state === "suspended") await ac.resume();
      if (running) return;
      running = true;
      step = 0;
      chord = 0;
      nextTime = ac.currentTime + 0.05;
      tick();
    },
    stop() {
      running = false;
      window.clearTimeout(timer);
      if (ctx && padGain) {
        padGain.gain.cancelScheduledValues(ctx.currentTime);
        padGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      }
    },
    setMuted(next) {
      muted = next;
      if (master && ctx) master.gain.setTargetAtTime(next ? 0 : MASTER, ctx.currentTime, 0.04);
    },
    setChapter(id) {
      shift = CHAPTER_SHIFT[id] ?? 0;
    },
    dispose() {
      running = false;
      window.clearTimeout(timer);
      try {
        crackle?.stop();
      } catch {
        /* already stopped */
      }
      void ctx?.close();
      ctx = null;
      master = null;
      padFilter = null;
      padGain = null;
      crackle = null;
    },
  };
}
