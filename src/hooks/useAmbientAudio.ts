"use client";

import { useEffect, useRef } from "react";

interface Nodes {
  ctx: AudioContext;
  master: GainNode;
  hiss: GainNode;
}

/**
 * Synthesised ambient room audio (low drone + filtered hiss) via Web Audio —
 * no audio file needed. Gated by `active` (starts on a user gesture). The hiss
 * rises on the corrupted channel.
 */
export function useAmbientAudio(active: boolean, corrupted: boolean) {
  const ref = useRef<Nodes | null>(null);

  useEffect(() => {
    if (!active) {
      const cur = ref.current;
      if (cur) cur.master.gain.setTargetAtTime(0.0001, cur.ctx.currentTime, 0.4);
      return;
    }

    let nodes = ref.current;
    if (!nodes) {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();

        const master = ctx.createGain();
        master.gain.value = 0.0001;
        master.connect(ctx.destination);

        // Low drone — a few detuned voices through a lowpass
        const drone = ctx.createGain();
        drone.gain.value = 0.5;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 380;
        drone.connect(lp);
        lp.connect(master);
        [55, 82.5, 110].forEach((f, i) => {
          const o = ctx.createOscillator();
          o.type = i === 2 ? "triangle" : "sine";
          o.frequency.value = f;
          o.connect(drone);
          o.start();
        });

        // Hiss — looping white noise through a bandpass
        const bufSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1800;
        bp.Q.value = 0.4;
        const hiss = ctx.createGain();
        hiss.gain.value = 0.02;
        noise.connect(bp);
        bp.connect(hiss);
        hiss.connect(master);
        noise.start();

        nodes = { ctx, master, hiss };
        ref.current = nodes;
      } catch {
        return;
      }
    }

    nodes.ctx.resume?.();
    nodes.master.gain.setTargetAtTime(0.05, nodes.ctx.currentTime, 0.6);
  }, [active]);

  useEffect(() => {
    const n = ref.current;
    if (!n) return;
    n.hiss.gain.setTargetAtTime(corrupted ? 0.06 : 0.02, n.ctx.currentTime, 0.5);
  }, [corrupted]);

  useEffect(() => {
    return () => {
      const n = ref.current;
      if (n) {
        try { n.ctx.close(); } catch { /* ignore */ }
        ref.current = null;
      }
    };
  }, []);
}
