import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  PricingCardPremiumMinecraft — Premium Minecraft-Themed Card    ║
// ║                                                                 ║
// ║  Features:                                                      ║
// ║  • Pixel-art / Minecraft aesthetic (pixel font, dirt/stone bg) ║
// ║  • GSAP Hover: card lift + pixel dirt particles burst upward   ║
// ║  • GSAP Click: TNT explosion shake + "BOOM!" text overlay      ║
// ║  • Minecraft-styled feature list with block icons              ║
// ║                                                                 ║
// ║  Props:                                                         ║
// ║  • plan        — plan name (default "Diamond")                 ║
// ║  • price       — price string (default "9,999")                ║
// ║  • currency    — currency label (default "💎 Emeralds")        ║
// ║  • period      — period string (default "/ season")            ║
// ║  • features    — string[] feature list                         ║
// ║  • ctaLabel    — CTA button text                               ║
// ║  • onCta       — () => void callback                           ║
// ╚══════════════════════════════════════════════════════════════════╝

const DEFAULT_FEATURES = [
  "Unlimited server access",
  "Diamond pickaxe tools",
  "Priority queue bypass",
  "Custom skin uploader",
  "Nether portal linking",
  "Ender chest encryption",
];

const PARTICLE_COLORS = [
  "#5a3e1e", // dark dirt
  "#7a5c2c", // brown
  "#6aaa40", // grass green
  "#4a7a30", // dark green
  "#8b7355", // sand
  "#a0856a", // light dirt
];

// A single pixel-cube particle element
const Particle = ({ idx, containerRef }) => {
  const ref = useRef(null);
  const color = PARTICLE_COLORS[idx % PARTICLE_COLORS.length];
  const size = 6 + (idx % 3) * 3; // 6px, 9px, or 12px

  return (
    <div
      ref={ref}
      className="particle absolute pointer-events-none"
      data-idx={idx}
      style={{
        width: size,
        height: size,
        background: color,
        imageRendering: "pixelated",
        opacity: 0,
        left: `${10 + ((idx * 13) % 80)}%`,
        bottom: 0,
        zIndex: 30,
      }}
    />
  );
};

const TOTAL_PARTICLES = 12;

export default function PricingCardPremiumMinecraft({
  plan = "Diamond",
  price = "9,999",
  currency = "💎 Emeralds",
  period = "/ season",
  features = DEFAULT_FEATURES,
  ctaLabel = "⚒ Craft Your Plan",
  onCta = null,
}) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const boomRef = useRef(null);
  const particleRefs = useRef([]);
  const isAnimating = useRef(false);
  const [showBoom, setShowBoom] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // ── Hover: lift card + burst pixel dirt particles ─────────────────
  const handleHoverEnter = contextSafe(() => {
    if (isAnimating.current) return;

    // Lift card
    gsap.to(cardRef.current, {
      y: -8,
      duration: 0.25,
      ease: "power2.out",
    });

    // Reset + burst particles
    particleRefs.current.forEach((el, i) => {
      if (!el) return;
      const startX = -20 + (i % 5) * 12; // spread X
      const peakY = -(40 + (i % 4) * 20); // height variance

      gsap.fromTo(
        el,
        { y: 0, x: 0, opacity: 0, scale: 0.5, rotation: 0 },
        {
          y: peakY,
          x: startX + (Math.random() - 0.5) * 30,
          opacity: 1,
          scale: 1,
          rotation: (Math.random() - 0.5) * 60,
          duration: 0.25,
          ease: "power2.out",
          delay: i * 0.025,
          onComplete: () => {
            gsap.to(el, {
              y: peakY + 20,
              opacity: 0,
              duration: 0.3,
              ease: "power1.in",
            });
          },
        },
      );
    });
  });

  const handleHoverLeave = contextSafe(() => {
    if (isAnimating.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: "elastic.out(1, 0.6)",
    });
  });

  // ── Click: TNT shake + BOOM overlay ──────────────────────────────
  const handleClick = contextSafe((e) => {
    e.stopPropagation();
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setShowBoom(false);
        gsap.set(cardRef.current, { x: 0, y: 0, scale: 1 });
      },
    });

    // 1. Screen flash red for 1 frame
    tl.to(cardRef.current, {
      scale: 1.03,
      duration: 0.08,
      ease: "power1.out",
    });

    // 2. TNT shake (rapid x oscillation)
    tl.to(cardRef.current, {
      x: -7,
      duration: 0.06,
      ease: "power1.inOut",
    }).to(cardRef.current, {
      x: 7,
      duration: 0.06,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 5,
    });

    // 3. Show BOOM
    tl.call(() => setShowBoom(true));
    tl.from(boomRef.current, {
      scale: 0.3,
      opacity: 0,
      duration: 0.2,
      ease: "back.out(3)",
    });

    // 4. Big particle burst on click
    particleRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { y: 0, x: 0, opacity: 0, scale: 0 },
        {
          y: -(60 + (i % 5) * 20),
          x: -60 + i * 12,
          opacity: 1,
          scale: 1.5,
          rotation: (i % 2 === 0 ? 1 : -1) * (30 + i * 10),
          duration: 0.4,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(el, { opacity: 0, y: "+=25", duration: 0.3 });
          },
        },
        i === 0 ? "<" : "<0.02",
      );
    });

    // 5. BOOM fade out
    tl.to(
      boomRef.current,
      { opacity: 0, scale: 1.5, duration: 0.4, ease: "power2.in" },
      "+=0.5",
    );

    // 6. Reset card position
    tl.to(cardRef.current, {
      x: 0,
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.5)",
    });
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] select-none"
      style={{ fontFamily: "'VT323', 'Courier New', monospace" }}
    >
      {/* Pixel font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');`}</style>

      {/* Floating particles layer */}
      <div
        className="absolute inset-0 overflow-visible pointer-events-none"
        style={{ zIndex: 20 }}
      >
        {Array.from({ length: TOTAL_PARTICLES }, (_, i) => (
          <div
            key={i}
            ref={(el) => (particleRefs.current[i] = el)}
            className="absolute pointer-events-none"
            style={{
              width: 6 + (i % 3) * 3,
              height: 6 + (i % 3) * 3,
              background: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
              imageRendering: "pixelated",
              opacity: 0,
              left: `${8 + ((i * 7) % 84)}%`,
              bottom: "0%",
            }}
          />
        ))}
      </div>

      {/* BOOM overlay */}
      {showBoom && (
        <div
          ref={boomRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 50 }}
        >
          <span
            className="text-7xl font-black tracking-widest"
            style={{
              color: "#ff4400",
              textShadow:
                "4px 4px 0 #ff8800, 8px 8px 0 #ffcc00, -2px -2px 0 #000",
              imageRendering: "pixelated",
            }}
          >
            BOOM!
          </span>
        </div>
      )}

      {/* Card */}
      <div
        ref={cardRef}
        className="relative rounded-none overflow-hidden cursor-pointer"
        onClick={handleClick}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
        style={{
          // Minecraft rough stone border effect via outline
          outline: "3px solid #000",
          outlineOffset: "2px",
          boxShadow: "6px 6px 0 #1a1a1a, inset 0 0 0 2px rgba(255,255,255,0.1)",
          imageRendering: "pixelated",
        }}
      >
        {/* Stone background texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent, transparent 16px,
                rgba(0,0,0,0.06) 16px, rgba(0,0,0,0.06) 17px
              ),
              repeating-linear-gradient(
                90deg,
                transparent, transparent 16px,
                rgba(0,0,0,0.06) 16px, rgba(0,0,0,0.06) 17px
              ),
              linear-gradient(135deg, #3a3a3a 0%, #2d2d2d 50%, #232323 100%)
            `,
          }}
        />

        {/* Grass top */}
        <div
          className="relative h-3 w-full"
          style={{
            background: "linear-gradient(180deg, #5aad35 0%, #4a9228 100%)",
          }}
        />

        {/* Dirt strip below grass */}
        <div
          className="relative h-2 w-full"
          style={{
            background: "linear-gradient(180deg, #8b5e3c 0%, #7a4f2e 100%)",
          }}
        />

        {/* Card content */}
        <div className="relative px-6 pt-5 pb-6">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="px-3 py-1 text-xs tracking-widest font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #1a6b1a 0%, #0e4a0e 100%)",
                border: "2px solid #000",
                boxShadow: "2px 2px 0 #000",
                fontSize: "16px",
                fontFamily: "inherit",
              }}
            >
              ⚒ CRAFTABLE — {plan.toUpperCase()}
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            <div
              className="text-white leading-none"
              style={{ fontSize: "52px", textShadow: "2px 2px 0 #000" }}
            >
              {price}
            </div>
            <div
              className="text-emerald-400 leading-snug"
              style={{ fontSize: "20px", textShadow: "1px 1px 0 #000" }}
            >
              {currency}
            </div>
            <div className="text-slate-400" style={{ fontSize: "16px" }}>
              {period}
            </div>
          </div>

          {/* Pixel divider */}
          <div
            className="my-4 w-full h-1"
            style={{
              background:
                "repeating-linear-gradient(90deg, #5aad35 0px, #5aad35 8px, #000 8px, #000 10px)",
            }}
          />

          {/* Features */}
          <div className="space-y-2 mb-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ fontSize: "18px" }}>▪</span>
                <span
                  className="text-slate-200"
                  style={{ fontSize: "18px", textShadow: "1px 1px 0 #000" }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-3 font-bold text-white transition-all active:translate-y-0.5"
            style={{
              background: "linear-gradient(180deg, #1a8a1a 0%, #0d5e0d 100%)",
              border: "3px solid #000",
              boxShadow: "0 4px 0 #000, inset 0 1px 0 rgba(255,255,255,0.15)",
              fontSize: "22px",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
              imageRendering: "pixelated",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCta?.();
            }}
          >
            {ctaLabel}
          </button>

          <p
            className="text-center text-slate-500 mt-3"
            style={{ fontSize: "14px" }}
          >
            Click card for TNT demo · Hover for particles
          </p>
        </div>
      </div>
    </div>
  );
}
