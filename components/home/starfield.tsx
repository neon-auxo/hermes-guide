// components/home/starfield.tsx
"use client";

import { useEffect, useRef } from "react";

// Astronomical star color palette
const STAR_COLORS = [
  [255, 252, 240], // warm white
  [200, 220, 255], // cool blue-white
  [255, 245, 180], // yellow-white
  [180, 200, 255], // pale blue
  [255, 210, 160], // warm orange-white
  [230, 190, 255], // lavender
  [255, 255, 255], // pure white
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
        speed: 0.8 + Math.random() * 2.0,
        base: 0.45 + Math.random() * 0.4,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    }

    let t = 0;

    function draw() {
      if (!canvas || !ctx) return;

      const isDark = document.documentElement.classList.contains("dark");
      // Only draw stars in dark mode
      if (!isDark) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.04;
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const alpha = Math.max(0.1, s.base + Math.sin(t * s.speed + s.phase) * 0.45);
        const [r, g, b] = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // glow for brighter stars
        if (s.r > 1.2 && alpha > 0.7) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`;
          ctx.fill();
        }
      }

      t += 0.04;
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
