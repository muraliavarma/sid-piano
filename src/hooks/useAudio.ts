import { useCallback, useRef } from 'react';
import { NOTES, type NoteName } from '../utils/notes';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playNote = useCallback((note: NoteName, duration = 1.2) => {
    const ctx = getCtx();
    const freq = NOTES[note].frequency;
    const now = ctx.currentTime;

    const harmonics = [
      { f: freq, g: 0.35 },
      { f: freq * 2, g: 0.12 },
      { f: freq * 3, g: 0.06 },
      { f: freq * 4, g: 0.03 },
      { f: freq * 5, g: 0.015 },
    ];

    harmonics.forEach(({ f, g }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(g, now + 0.005);
      gain.gain.setTargetAtTime(g * 0.4, now + 0.005, 0.08);
      gain.gain.setTargetAtTime(0.001, now + 0.3, duration * 0.4);

      osc.start(now);
      osc.stop(now + duration + 0.5);
    });
  }, [getCtx]);

  const playCorrect = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = now + i * 0.08;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.setTargetAtTime(0.001, t + 0.05, 0.15);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }, [getCtx]);

  const playWrong = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 180;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.setTargetAtTime(0.001, now + 0.05, 0.12);
    osc.start(now);
    osc.stop(now + 0.5);
  }, [getCtx]);

  return { playNote, playCorrect, playWrong };
}
