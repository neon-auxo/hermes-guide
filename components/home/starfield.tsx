// components/home/starfield.tsx
"use client";

import { useEffect, useRef } from "react";

// Dark mode: bright astronomical star colors
const DARK_COLORS = [
  [255, 252, 240], // warm white
  [200, 220, 255], // cool blue-white
  [255, 245, 180], // yellow-white
  [180, 200, 255], // pale blue
  [255, 210, 160], // warm orange-white
  [230, 190, 255], // lavender
  [255, 255, 255], // pure white
];

// Light mode: deep purple/indigo tones visible on light bg
const LIGHT_COLORS = [
  [80,  60, 160],  // deep indigo
  [100, 70, 180],  // purple
  [60,  80, 180],  // deep blue-purple
  [120, 80, 200],  // violet
  [70,  60, 140],  // dark navy-purple
  [100, 90, 170],  // medium indigo
];

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  base: number;
  color: number[];
};

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    }

    function init() {
      if (!canvas) return;
      const count = Math.floor((canvas.width * canvas.height) / 4000);
      stars = Array.from({ length: Math.min(count, 280) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.9,
        base: 0.45 + Math.random() * 0.4,
        color: DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)],
      }));
    }

    let t = 0;

    function draw() {
      if (!canvas || !ctx) return;

      const isDark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const alpha = Math.max(0.1, s.base + Math.sin(t * s.speed + s.phase) * 0.45);
        const col = isDark
          ? s.color
          : LIGHT_COLORS[Math.floor(Math.abs(Math.sin(s.phase * 7)) * LIGHT_COLORS.length)];
        const [r, g, b] = col;
        const a = isDark ? alpha : alpha * 0.55;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();

        // glow for brighter stars (dark mode only)
        if (isDark && s.r > 1.2 && alpha > 0.7) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`;
          ctx.fill();
        }
      }

      t += 0.02;
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
