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

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  base: number;
  color: number[];
};

// Aurora bands for light mode
const AURORA_BANDS = [
  { yRatio: 0.08, color: [100, 220, 210] as [number,number,number], alpha: 0.28, freq: 0.0025, amp: 55, speed: 0.18 },
  { yRatio: 0.20, color: [180, 120, 255] as [number,number,number], alpha: 0.22, freq: 0.0035, amp: 45, speed: 0.25 },
  { yRatio: 0.32, color: [80,  200, 180] as [number,number,number], alpha: 0.18, freq: 0.0020, amp: 65, speed: 0.14 },
  { yRatio: 0.14, color: [230, 130, 220] as [number,number,number], alpha: 0.16, freq: 0.0040, amp: 40, speed: 0.30 },
];

function drawAurora(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  for (const band of AURORA_BANDS) {
    const baseY = h * band.yRatio;
    const bandH = h * 0.28;
    const [r, g, b] = band.color;

    // vertical gradient: fade in then fade out
    const grad = ctx.createLinearGradient(0, baseY - bandH, 0, baseY + bandH);
    grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
    grad.addColorStop(0.4, `rgba(${r},${g},${b},${band.alpha})`);
    grad.addColorStop(0.6, `rgba(${r},${g},${b},${band.alpha})`);
    grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

    // draw undulating band shape
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 6) {
      const y =
        baseY +
        Math.sin(x * band.freq + t * band.speed) * band.amp +
        Math.sin(x * band.freq * 0.6 + t * band.speed * 0.8 + 1.2) * band.amp * 0.4;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

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
      initStars();
    }

    function initStars() {
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

      if (isDark) {
        // twinkling stars
        for (const s of stars) {
          const alpha = Math.max(0.1, s.base + Math.sin(t * s.speed + s.phase) * 0.45);
          const [r, g, b] = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
          if (s.r > 1.2 && alpha > 0.7) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.12})`;
            ctx.fill();
          }
        }
        t += 0.02;
      } else {
        // aurora bands
        drawAurora(ctx, canvas.width, canvas.height, t);
        t += 0.01;
      }

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
