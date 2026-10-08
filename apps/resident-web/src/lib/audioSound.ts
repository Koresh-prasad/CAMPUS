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
 */
export function playCuteNotificationSound(volume = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 783.99, time: 0.00, dur: 0.16, gain: volume * 0.8 },  // G5
      { freq: 1046.50, time: 0.07, dur: 0.20, gain: volume * 0.9 }, // C6
      { freq: 1318.51, time: 0.14, dur: 0.24, gain: volume * 1.0 }, // E6
      { freq: 1567.98, time: 0.21, dur: 0.45, gain: volume * 1.1 }, // G6 (sparkle ring)
    ];

    notes.forEach(({ freq, time, dur, gain: noteGain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gainNode.gain.setValueAtTime(0.001, now + time);
      gainNode.gain.linearRampToValueAtTime(noteGain, now + time + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + dur);

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
 */
export function playCuteBubblePop(volume = 0.2) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
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
