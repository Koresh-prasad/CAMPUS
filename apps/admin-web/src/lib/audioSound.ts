/**
 * Cute & Delightful Audio Synthesizer Chimes
 * Powered by Web Audio API — zero external assets, zero latency, 100% reliable offline.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn('AudioContext initialization note:', e);
    return null;
  }
}

/**
 * 🎵 Cute Notification Chime
 * Bright, joyful, crystal bell sparkle arpeggio (G5 -> C6 -> E6 -> G6)
 * Sounds like a delightful messenger / game notification chime.
 */
export function playCuteNotificationSound(volume = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Four crystal bell notes (pentatonic major arpeggio)
    const notes = [
      { freq: 783.99, time: 0.00, dur: 0.16, gain: volume * 0.8 },  // G5
      { freq: 1046.50, time: 0.07, dur: 0.20, gain: volume * 0.9 }, // C6
      { freq: 1318.51, time: 0.14, dur: 0.24, gain: volume * 1.0 }, // E6
      { freq: 1567.98, time: 0.21, dur: 0.45, gain: volume * 1.1 }, // G6 (sparkle ring)
    ];

    notes.forEach(({ freq, time, dur, gain: noteGain }) => {
      // 1. Pure sweet sine wave fundamental
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Fast soft attack (avoids click) and smooth exponential bell decay
      gainNode.gain.setValueAtTime(0.001, now + time);
      gainNode.gain.linearRampToValueAtTime(noteGain, now + time + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + dur);

      // 2. Sweet triangle harmonic overtone (gives music-box / celesta sparkle)
      const harmonic = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 2, now + time);

      harmGain.gain.setValueAtTime(0.001, now + time);
      harmGain.gain.linearRampToValueAtTime(noteGain * 0.18, now + time + 0.012);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + time + (dur * 0.5));

      harmonic.connect(harmGain);
      harmGain.connect(ctx.destination);
      harmonic.start(now + time);
      harmonic.stop(now + time + (dur * 0.5));
    });
  } catch (err) {
    console.warn('Cute chime playback notice:', err);
  }
}

/**
 * ✨ Cute Success Ding
 * Upbeat 2-tone "ding-ting!" when user submits forms, queries, or passes.
 */
export function playCuteSuccessSound(volume = 0.25) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 880.00, time: 0.00, dur: 0.12, gain: volume * 0.8 },  // A5
      { freq: 1318.51, time: 0.09, dur: 0.35, gain: volume * 1.0 }, // E6
    ];

    notes.forEach(({ freq, time, dur, gain: noteGain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gainNode.gain.setValueAtTime(0.001, now + time);
      gainNode.gain.linearRampToValueAtTime(noteGain, now + time + 0.012);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (err) {
    console.warn('Cute success ding notice:', err);
  }
}

/**
 * 🫧 Cute Bubble Pop
 * Cheerful pop sound when clicking buttons or opening dialogs.
 */
export function playCuteBubblePop(volume = 0.2) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    // Frequency ramps up quickly like a bubble popping
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.06);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (err) {
    console.warn('Cute bubble pop notice:', err);
  }
}

/**
 * 🚪 Unique Gate Pass Notification Sound
 * Distinct, clear, majestic turnstile chime fanfare (E5 -> A5 -> C#6 -> E6).
 * Audible cue that instantly differentiates a student gate pass request from common notifications.
 */
export function playGatePassUniqueSound(volume = 0.35) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Elegant trumpet / gate chime sequence
    const notes = [
      { freq: 659.25, time: 0.00, dur: 0.14, gain: volume * 0.75 }, // E5
      { freq: 880.00, time: 0.10, dur: 0.16, gain: volume * 0.85 }, // A5
      { freq: 1108.73, time: 0.20, dur: 0.18, gain: volume * 0.95 }, // C#6
      { freq: 1318.51, time: 0.30, dur: 0.55, gain: volume * 1.10 }, // E6 (lingering gate chime)
    ];

    notes.forEach(({ freq, time, dur, gain: noteGain }) => {
      // Primary chime
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gainNode.gain.setValueAtTime(0.001, now + time);
      gainNode.gain.linearRampToValueAtTime(noteGain, now + time + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + dur);

      // Sweet sine bell overtone
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq * 1.5, now + time);
      bellGain.gain.setValueAtTime(0.001, now + time);
      bellGain.gain.linearRampToValueAtTime(noteGain * 0.25, now + time + 0.01);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + time + (dur * 0.7));
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start(now + time);
      bell.stop(now + time + (dur * 0.7));
    });
  } catch (err) {
    console.warn('Gate pass unique sound error:', err);
  }
}

/**
 * 🚨 Realistic Emergency SOS Siren Alarm
 * Dual-cycle rising and falling siren horn with high-urgency modulation.
 * Instantly commands attention across the admin control console!
 */
export function playEmergencySirenSound(volume = 0.4, cycles = 2) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const cycleDuration = 0.75; // 750ms per sweep up/down

    for (let i = 0; i < cycles; i++) {
      const cycleStart = now + i * cycleDuration;

      // Primary siren oscillator
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';

      // Sweep from 650Hz to 1200Hz and back to 700Hz
      osc1.frequency.setValueAtTime(650, cycleStart);
      osc1.frequency.exponentialRampToValueAtTime(1250, cycleStart + cycleDuration * 0.5);
      osc1.frequency.exponentialRampToValueAtTime(700, cycleStart + cycleDuration);

      gain1.gain.setValueAtTime(0.001, cycleStart);
      gain1.gain.linearRampToValueAtTime(volume * 0.55, cycleStart + 0.05);
      gain1.gain.setValueAtTime(volume * 0.55, cycleStart + cycleDuration - 0.05);
      gain1.gain.linearRampToValueAtTime(0.001, cycleStart + cycleDuration);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(cycleStart);
      osc1.stop(cycleStart + cycleDuration);

      // Secondary detuned siren oscillator for acoustic thickness / urgency
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';

      osc2.frequency.setValueAtTime(658, cycleStart);
      osc2.frequency.exponentialRampToValueAtTime(1260, cycleStart + cycleDuration * 0.5);
      osc2.frequency.exponentialRampToValueAtTime(708, cycleStart + cycleDuration);

      gain2.gain.setValueAtTime(0.001, cycleStart);
      gain2.gain.linearRampToValueAtTime(volume * 0.45, cycleStart + 0.05);
      gain2.gain.setValueAtTime(volume * 0.45, cycleStart + cycleDuration - 0.05);
      gain2.gain.linearRampToValueAtTime(0.001, cycleStart + cycleDuration);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(cycleStart);
      osc2.stop(cycleStart + cycleDuration);
    }
  } catch (err) {
    console.warn('Emergency siren playback error:', err);
  }
}
