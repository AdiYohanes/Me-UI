import React, { useState, useEffect, useRef } from "react";

// ─── 1. Ring Spinner ─────────────────────────────────────────────────
export function LoaderSpinner() {
  return (
    <div className="flex items-center gap-6">
      <div className="w-6 h-6 rounded-full border-[3px] border-slate-200 border-t-blue-600 animate-spin" />
      <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-purple-600 animate-spin" />
      <div className="w-14 h-14 rounded-full border-[5px] border-slate-200 border-t-rose-500 animate-spin" />
    </div>
  );
}

// ─── 2. Bouncing Dots ────────────────────────────────────────────────
export function LoaderDots() {
  return (
    <div className="flex flex-col items-center gap-5">
      {[
        ["bg-blue-600", "Fetching data"],
        ["bg-violet-600", "Loading assets"],
        ["bg-emerald-500", "Connecting"],
      ].map(([color, label], ri) => (
        <div key={ri} className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${color} animate-bounce`}
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── 3. Pulse Rings ──────────────────────────────────────────────────
export function LoaderPulse() {
  const colors = [
    { ring: "bg-blue-500", label: "Active" },
    { ring: "bg-purple-500", label: "Syncing" },
    { ring: "bg-rose-500", label: "Live" },
  ];

  return (
    <div className="flex items-center gap-8">
      {colors.map(({ ring, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center w-12 h-12">
            <div
              className={`absolute w-full h-full rounded-full ${ring} opacity-20 animate-ping`}
            />
            <div
              className={`absolute w-8 h-8 rounded-full ${ring} opacity-30 animate-ping`}
              style={{ animationDelay: "200ms" }}
            />
            <div className={`w-5 h-5 rounded-full ${ring}`} />
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── 4. Progress Bar / Shimmer ───────────────────────────────────────
export function LoaderBar() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const duration = 3000;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          startRef.current = null;
          setProgress(0);
          rafRef.current = requestAnimationFrame(animate);
        }, 800);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col gap-4 items-start w-56">
      {/* Indeterminate shimmer bar */}
      <div className="relative h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="absolute h-full w-2/5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
          style={{
            animation: "bar-shimmer 1.4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Determinate progress bar */}
      <div className="relative h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Striped animated bar */}
      <div className="relative h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${70}%`,
            backgroundImage:
              "repeating-linear-gradient(45deg, #f43f5e, #f43f5e 8px, #fb7185 8px, #fb7185 16px)",
            backgroundSize: "24px 100%",
            animation: "stripes 0.6s linear infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes bar-shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(280%); }
        }
        @keyframes stripes {
          0% { background-position: 0 0; }
          100% { background-position: 24px 0; }
        }
      `}</style>
    </div>
  );
}

// ─── 5. Skeleton Placeholder ─────────────────────────────────────────
function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`rounded-lg bg-slate-200 relative overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "sk-shimmer 1.5s infinite",
      }}
    >
      <style>{`@keyframes sk-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}

export function LoaderSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-64 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <SkeletonBlock
          className="w-10 h-10 flex-shrink-0"
          style={{ borderRadius: "50%" }}
        />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBlock className="h-3 w-3/4" />
          <SkeletonBlock className="h-2.5 w-1/2" />
        </div>
      </div>
      <SkeletonBlock className="h-24 w-full rounded-xl" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-5/6" />
      <SkeletonBlock className="h-3 w-4/6" />
    </div>
  );
}

// ─── 6. Dual-Orbit Loader ────────────────────────────────────────────
export function LoaderOrbit() {
  const variants = [
    { size: 40, c1: "#3b82f6", c2: "#e11d48", spd1: 1.6, spd2: 1.1 },
    { size: 54, c1: "#8b5cf6", c2: "#f59e0b", spd1: 1.4, spd2: 0.9 },
    { size: 46, c1: "#10b981", c2: "#06b6d4", spd1: 1.8, spd2: 1.2 },
  ];

  return (
    <>
      <style>{`
        @keyframes orbit-cw  { to { transform: rotate(360deg); } }
        @keyframes orbit-ccw { to { transform: rotate(-360deg); } }
      `}</style>
      <div className="flex items-center gap-10">
        {variants.map(({ size, c1, c2, spd1, spd2 }, idx) => (
          <div
            key={idx}
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            {/* Center */}
            <div className="w-2 h-2 rounded-full bg-slate-400 z-10 relative" />

            {/* Orbit 1 — CW */}
            <div
              className="absolute inset-0 rounded-full border border-slate-200"
              style={{ animation: `orbit-cw ${spd1}s linear infinite` }}
            >
              <div
                className="absolute w-3 h-3 rounded-full shadow-lg"
                style={{
                  background: c1,
                  top: -6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: `0 0 8px ${c1}80`,
                }}
              />
            </div>

            {/* Orbit 2 — CCW */}
            <div
              className="absolute rounded-full border border-slate-200"
              style={{
                inset: 7,
                animation: `orbit-ccw ${spd2}s linear infinite`,
              }}
            >
              <div
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: c2,
                  top: -5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: `0 0 6px ${c2}80`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
