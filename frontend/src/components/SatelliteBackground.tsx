"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Satellite } from "lucide-react";

const buildStarfield = (count: number) => {
  const stars: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = Math.round(((Math.sin(i * 12.9898) + 1) / 2) * 2000 - 1000);
    const y = Math.round(((Math.sin(i * 78.233) + 1) / 2) * 1200 - 600);
    const opacity = 0.2 + ((i * 0.17) % 0.6);
    stars.push(`${x}px ${y}px rgba(255,255,255,${opacity.toFixed(2)})`);
  }
  return stars.join(", ");
};

const orbits = [
  { size: 220, duration: 26, opacity: 0.25 },
  { size: 320, duration: 34, opacity: 0.18 },
  { size: 420, duration: 42, opacity: 0.14 },
  { size: 520, duration: 50, opacity: 0.12 },
];

const satellites = [
  { size: 220, duration: 26, delay: 0 },
  { size: 320, duration: 34, delay: 4 },
  { size: 420, duration: 42, delay: 8 },
  { size: 520, duration: 50, delay: 12 },
];

export default function SatelliteBackground() {
  const starfield = useMemo(() => buildStarfield(120), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-70">
        <div
          className="absolute left-1/2 top-1/2 h-1 w-1"
          style={{ boxShadow: starfield }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute h-24 w-24 rounded-full bg-teal-400/20 blur-2xl" />
        <div className="absolute h-10 w-10 rounded-full bg-teal-300/80 shadow-[0_0_40px_rgba(20,184,166,0.8)]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {orbits.map((orbit) => (
          <div
            key={orbit.size}
            className="absolute rounded-full border border-dashed border-teal-200/40"
            style={{
              width: orbit.size,
              height: orbit.size,
              opacity: orbit.opacity,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {satellites.map((satellite) => (
          <motion.div
            key={satellite.size}
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{
              duration: satellite.duration,
              repeat: Infinity,
              ease: "linear",
              delay: satellite.delay,
            }}
            style={{ width: satellite.size, height: satellite.size }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <div className="relative flex items-center justify-center">
                <div className="absolute -bottom-12 h-12 w-14 bg-gradient-to-b from-teal-400/30 to-transparent blur-sm" />
                <Satellite className="h-5 w-5 text-teal-200/90 drop-shadow-[0_0_12px_rgba(20,184,166,0.6)]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
