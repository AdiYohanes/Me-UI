import React, { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  ThemeTogglePremium — Day/Night Scene Toggle                   ║
// ║                                                                ║
// ║  Design reference: Dribbble sun/moon toggle with large knob   ║
// ║  • Large circular knob (sun ↔ moon) filling most of track     ║
// ║  • Track background: sky gradient with clouds (day) /          ║
// ║    dark navy with diamond stars (night)                        ║
// ║  • Smooth GSAP timeline transitions                            ║
// ║                                                                ║
// ║  Props (template-configurable):                                ║
// ║  • isDark      — boolean: controlled dark state                ║
// ║  • onToggle    — () => void: toggle callback                   ║
// ║  • size        — "sm" | "md" | "lg" (scale)                    ║
// ║  • lightLabel  — string: label for light mode                  ║
// ║  • darkLabel   — string: label for dark mode                   ║
// ║  • showLabel   — boolean: show/hide label text                 ║
// ║  • sunColor    — string: sun gradient start color              ║
// ║  • skyColors   — [string, string]: sky gradient                ║
// ║  • nightColors — [string, string]: night gradient              ║
// ║  • className   — string: extra wrapper classes                 ║
// ╚══════════════════════════════════════════════════════════════════╝

const SIZES = {
  sm: { w: 140, h: 70, knob: 58, pad: 6 },
  md: { w: 200, h: 100, knob: 84, pad: 8 },
  lg: { w: 260, h: 130, knob: 110, pad: 10 },
};

export default function ThemeTogglePremium({
  isDark: controlledDark,
  onToggle,
  size = "md",
  lightLabel = "Light Mode",
  darkLabel = "Dark Mode",
  showLabel = true,
  sunColor = "#F5A623",
  skyColors = ["#7EC8E3", "#B8D8F0"],
  nightColors = ["#1a1a3e", "#2d2b55"],
  className = "",
}) {
  const [internalDark, setInternalDark] = useState(false);
  const dark = controlledDark !== undefined ? controlledDark : internalDark;

  const sceneRef = useRef(null);
  const tlRef = useRef(null);
  const dims = SIZES[size] || SIZES.md;
  const travel = dims.w - dims.knob - dims.pad * 2;

  const toggle = useCallback(() => {
    if (onToggle) onToggle();
    else setInternalDark((p) => !p);
  }, [onToggle]);

  // ─── GSAP orchestrated timeline ─────────────────────────────────
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const q = (s) => el.querySelector(s);
    const qAll = (s) => el.querySelectorAll(s);

    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    if (dark) {
      // ── TO NIGHT ──
      tl
        // Track bg → dark navy
        .to(
          q(".track-bg"),
          {
            background: `linear-gradient(135deg, ${nightColors[0]} 0%, ${nightColors[1]} 100%)`,
            duration: 0.6,
          },
          0,
        )
        // Knob slides right
        .to(q(".knob"), { x: travel, duration: 0.5, ease: "back.out(1.5)" }, 0)
        // Sun → Moon knob colors
        .to(
          q(".knob-face"),
          {
            background:
              "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #b0bec5 100%)",
            boxShadow:
              "0 4px 20px rgba(200, 210, 230, 0.3), inset 0 -4px 8px rgba(0,0,0,0.06)",
            duration: 0.5,
          },
          0,
        )
        // Sun face out
        .to(
          q(".sun-face"),
          { opacity: 0, scale: 0.5, rotation: -90, duration: 0.35 },
          0,
        )
        // Moon face in
        .to(
          q(".moon-face"),
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.45,
            ease: "back.out(1.4)",
          },
          0.12,
        )
        // Clouds out
        .to(
          qAll(".cloud"),
          { opacity: 0, y: 15, scale: 0.7, duration: 0.35, stagger: 0.04 },
          0,
        )
        // Stars in
        .to(
          qAll(".star-4"),
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: { each: 0.04, from: "random" },
          },
          0.2,
        )
        // Star shimmer (infinite)
        .to(
          qAll(".star-shimmer"),
          {
            opacity: 0.6,
            scale: 1.4,
            duration: 1.2,
            stagger: { each: 0.15, from: "random" },
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
          0.5,
        );
    } else {
      // ── TO DAY ──
      tl
        // Track bg → sky blue
        .to(
          q(".track-bg"),
          {
            background: `linear-gradient(135deg, ${skyColors[0]} 0%, ${skyColors[1]} 100%)`,
            duration: 0.6,
          },
          0,
        )
        // Knob slides left
        .to(q(".knob"), { x: 0, duration: 0.5, ease: "back.out(1.5)" }, 0)
        // Moon → Sun knob colors
        .to(
          q(".knob-face"),
          {
            background: `linear-gradient(135deg, ${sunColor} 0%, #F7C948 50%, #FFD54F 100%)`,
            boxShadow: `0 4px 24px rgba(245, 166, 35, 0.45), inset 0 -4px 8px rgba(0,0,0,0.05)`,
            duration: 0.5,
          },
          0,
        )
        // Moon face out
        .to(
          q(".moon-face"),
          { opacity: 0, scale: 0.5, rotation: 90, duration: 0.35 },
          0,
        )
        // Sun face in
        .to(
          q(".sun-face"),
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.45,
            ease: "back.out(1.4)",
          },
          0.12,
        )
        // Stars out
        .to(qAll(".star-4"), { opacity: 0, scale: 0, duration: 0.25 }, 0)
        .to(qAll(".star-shimmer"), { opacity: 0, scale: 0, duration: 0.2 }, 0)
        // Clouds in
        .to(
          qAll(".cloud"),
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06 },
          0.15,
        );
    }

    tlRef.current = tl;
    return () => tl.kill();
  }, [dark, travel, sunColor, skyColors, nightColors]);

  // Knob press/release micro-interaction
  const handlePress = () => {
    const knob = sceneRef.current?.querySelector(".knob");
    if (knob) gsap.to(knob, { scale: 0.92, duration: 0.1 });
  };
  const handleRelease = () => {
    const knob = sceneRef.current?.querySelector(".knob");
    if (knob)
      gsap.to(knob, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.4)" });
    toggle();
  };
  const handleLeave = () => {
    const knob = sceneRef.current?.querySelector(".knob");
    if (knob) gsap.to(knob, { scale: 1, duration: 0.2 });
  };

  // ─── Star positions (diamond ✦ shapes) ──────────────────────────
  const stars = [
    { x: 18, y: 28, s: 0.7, shimmer: true },
    { x: 30, y: 50, s: 0.5, shimmer: false },
    { x: 22, y: 65, s: 0.6, shimmer: true },
    { x: 42, y: 35, s: 0.8, shimmer: false },
    { x: 50, y: 58, s: 0.55, shimmer: true },
    { x: 35, y: 22, s: 0.45, shimmer: false },
    { x: 55, y: 25, s: 0.65, shimmer: true },
    { x: 28, y: 42, s: 0.5, shimmer: false },
    { x: 45, y: 70, s: 0.4, shimmer: true },
    { x: 15, y: 48, s: 0.55, shimmer: false },
  ];

  const knobR = dims.knob / 2;

  return (
    <div className={`inline-flex flex-col items-center gap-4 ${className}`}>
      {/* ═══ Toggle Switch ═══ */}
      <button
        ref={sceneRef}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleLeave}
        onTouchStart={handlePress}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleRelease();
        }}
        className="relative select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2"
        style={{
          width: dims.w,
          height: dims.h,
          borderRadius: dims.h / 2,
          border: "none",
          padding: 0,
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
        aria-label={dark ? darkLabel : lightLabel}
        role="switch"
        aria-checked={dark}
      >
        {/* ── Track Background ── */}
        <div
          className="track-bg absolute inset-0"
          style={{
            borderRadius: dims.h / 2,
            background: dark
              ? `linear-gradient(135deg, ${nightColors[0]} 0%, ${nightColors[1]} 100%)`
              : `linear-gradient(135deg, ${skyColors[0]} 0%, ${skyColors[1]} 100%)`,
            overflow: "hidden",
          }}
        >
          {/* ── Clouds (Day scene — inside track) ── */}
          {/* Cloud cluster bottom-right */}
          <svg
            className="cloud absolute pointer-events-none"
            style={{
              right: -2,
              bottom: -4,
              width: dims.w * 0.55,
              height: dims.h * 0.65,
              opacity: dark ? 0 : 1,
            }}
            viewBox="0 0 120 70"
            fill="none"
          >
            <ellipse
              cx="60"
              cy="52"
              rx="58"
              ry="22"
              fill="white"
              opacity="0.95"
            />
            <ellipse
              cx="85"
              cy="38"
              rx="32"
              ry="24"
              fill="white"
              opacity="0.98"
            />
            <ellipse
              cx="45"
              cy="42"
              rx="28"
              ry="20"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="70"
              cy="30"
              rx="20"
              ry="16"
              fill="white"
              opacity="0.85"
            />
          </svg>

          {/* Small cloud top-center */}
          <svg
            className="cloud absolute pointer-events-none"
            style={{
              right: dims.w * 0.15,
              top: dims.h * 0.08,
              width: dims.w * 0.22,
              height: dims.h * 0.28,
              opacity: dark ? 0 : 0.6,
            }}
            viewBox="0 0 50 25"
            fill="none"
          >
            <ellipse
              cx="25"
              cy="16"
              rx="24"
              ry="9"
              fill="white"
              opacity="0.8"
            />
            <ellipse
              cx="18"
              cy="11"
              rx="12"
              ry="9"
              fill="white"
              opacity="0.85"
            />
          </svg>

          {/* ── Stars (Night scene — diamond 4-pointed shapes) ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${dims.w} ${dims.h}`}
          >
            {stars.map((st, i) => {
              const sx = (st.x / 100) * dims.w;
              const sy = (st.y / 100) * dims.h;
              const scale = st.s * (dims.w / 200);
              return (
                <g
                  key={i}
                  className={`star-4 ${st.shimmer ? "star-shimmer" : ""}`}
                  transform={`translate(${sx}, ${sy})`}
                  opacity={dark ? 1 : 0}
                  style={{
                    transformOrigin: `${sx}px ${sy}px`,
                    transform: `translate(${sx}px, ${sy}px) scale(${dark ? 1 : 0})`,
                  }}
                >
                  {/* 4-pointed diamond star */}
                  <path
                    d={`M0 ${-5 * scale} L${1.5 * scale} 0 L0 ${5 * scale} L${-1.5 * scale} 0 Z`}
                    fill="#c5cae9"
                    opacity="0.8"
                  />
                  <path
                    d={`M${-4 * scale} 0 L0 ${-1.2 * scale} L${4 * scale} 0 L0 ${1.2 * scale} Z`}
                    fill="#c5cae9"
                    opacity="0.6"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Knob (Sun/Moon) ── */}
        <div
          className="knob absolute"
          style={{
            top: dims.pad,
            left: dims.pad,
            width: dims.knob,
            height: dims.knob,
            zIndex: 10,
            transform: `translateX(${dark ? travel : 0}px)`,
          }}
        >
          <div
            className="knob-face relative w-full h-full rounded-full"
            style={{
              background: dark
                ? "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #b0bec5 100%)"
                : `linear-gradient(135deg, ${sunColor} 0%, #F7C948 50%, #FFD54F 100%)`,
              boxShadow: dark
                ? "0 4px 20px rgba(200, 210, 230, 0.3), inset 0 -4px 8px rgba(0,0,0,0.06)"
                : "0 4px 24px rgba(245, 166, 35, 0.45), inset 0 -4px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            {/* ── Sun Face (visible in light mode) ── */}
            <div
              className="sun-face absolute inset-0 flex items-center justify-center"
              style={{ opacity: dark ? 0 : 1 }}
            >
              {/* Inner glow circle */}
              <div
                className="rounded-full"
                style={{
                  width: "60%",
                  height: "60%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
                }}
              />
            </div>

            {/* ── Moon Face (visible in dark mode) ── */}
            <div
              className="moon-face absolute inset-0"
              style={{ opacity: dark ? 1 : 0 }}
            >
              {/* Moon craters — subtle circular indentations */}
              <div
                className="absolute rounded-full"
                style={{
                  top: "22%",
                  right: "18%",
                  width: "32%",
                  height: "32%",
                  background:
                    "radial-gradient(circle at 35% 35%, rgba(176,190,197,0.5) 0%, rgba(197,202,233,0.3) 100%)",
                  boxShadow: "inset 1px 2px 4px rgba(0,0,0,0.08)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  top: "55%",
                  right: "35%",
                  width: "22%",
                  height: "22%",
                  background:
                    "radial-gradient(circle at 35% 35%, rgba(176,190,197,0.45) 0%, rgba(197,202,233,0.25) 100%)",
                  boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.06)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  top: "18%",
                  left: "22%",
                  width: "16%",
                  height: "16%",
                  background:
                    "radial-gradient(circle at 35% 35%, rgba(176,190,197,0.4) 0%, rgba(197,202,233,0.2) 100%)",
                  boxShadow: "inset 0.5px 1px 2px rgba(0,0,0,0.05)",
                }}
              />
            </div>
          </div>
        </div>
      </button>

      {/* ═══ Label ═══ */}
      {showLabel && (
        <span
          className="text-sm font-semibold tracking-wide select-none transition-colors duration-500"
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
            color: dark ? "#94a3b8" : "#64748b",
          }}
        >
          {dark ? darkLabel : lightLabel}
        </span>
      )}
    </div>
  );
}
